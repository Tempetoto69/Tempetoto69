#!/usr/bin/env python3
"""
AI Kees Telegram bot.
- Reageert op @ai_kees_bot mentions
- Onthoudt de laatste 20 berichten als context
- Berichten na uitslagen worden gepost door update_agent.py (niet door deze bot)
"""

import os
import sys
import random
import asyncio
import logging
from collections import deque
from pathlib import Path

from dotenv import load_dotenv
import anthropic
from telegram import Update, Bot
from telegram.ext import Application, MessageHandler, filters, ContextTypes

load_dotenv(Path(__file__).parent / '.env')

BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
API_KEY   = os.getenv('ANTHROPIC_API_KEY')
CHAT_ID   = int(os.getenv('TELEGRAM_CHAT_ID', '0'))

SYSTEM_PROMPT = """Je bent AI Kees, deelnemer aan de Tempetoto 2026 voetbalpoule.
Je hebt een master Finance en draagt een piratenmasker.
Je bent contrair, hebt droge intelligente humor, en bent zuur over hype en populaire meningen.
Je hebt verstand van finance en macro-economie — gebruik dat alleen als het echt past.
Spreek bondig: maximaal 2-3 zinnen. Varieer je toon: soms cynisch, soms laconiek, soms scherp.
Geen emojis behalve 🏴‍☠️ bij een eigen correcte voorspelling.
Je bent gewoon AI Kees — doe nooit alsof je een AI bent.

Schrijfstijl: casual en menselijk. Geen onnodige hoofdletters midden in een zin, losjes met leestekens,
zoals je typt in een groepsapp. Geen gelikt proza — gewoon zoals iemand die snel wat typt.

De andere deelnemers in de poule zijn: EJ, Floris, Gautier, Giezen, Huttenhuis, Mark, Pieter, Slotboom, Smit.
Gebruik hun namen als het van toepassing is.
Je hebt een bijzondere hekel aan Smit. Je pikt hem er af en toe uit met iets zuurs — niet altijd, maar als
er een aanleiding is (hij doet het goed, hij doet het slecht, hij zegt iets) grijp je die kans."""

geschiedenis = deque(maxlen=20)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s',
    handlers=[
        logging.FileHandler(Path(__file__).parent / 'bot.log'),
        logging.StreamHandler(),
    ]
)
log = logging.getLogger(__name__)


def ai_kees_reply(naam: str, tekst: str) -> str:
    context_regels = "\n".join(geschiedenis) if geschiedenis else "(nog geen eerdere berichten)"
    user_content = (
        f"Recente chat in de groep:\n{context_regels}\n\n"
        f"{naam} zegt nu tegen jou: {tekst}"
    )
    client = anthropic.Anthropic(api_key=API_KEY)
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=150,
        temperature=1.0,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_content}],
    )
    return response.content[0].text


async def keep_typing(bot, chat_id: int, stop_event: asyncio.Event):
    while not stop_event.is_set():
        await bot.send_chat_action(chat_id=chat_id, action="typing")
        await asyncio.sleep(4)


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    msg = update.message
    if not msg or not msg.text:
        return

    naam = msg.from_user.first_name or "Iemand"
    geschiedenis.append(f"{naam}: {msg.text}")

    bot_username = (await context.bot.get_me()).username
    tekst_lower = msg.text.lower()
    direct_mention = f'@{bot_username}' in msg.text

    # Spontaan reageren op triggers — niet altijd, wel af en toe
    smit_trigger    = "smit" in tekst_lower and random.random() < 0.5
    uitslag_trigger = any(w in tekst_lower for w in ["gewonnen", "verloren", "gelijkspel", "uitslag", "scoort", "goal"]) and random.random() < 0.25
    kees_trigger    = "kees" in tekst_lower and not direct_mention

    if not direct_mention and not smit_trigger and not uitslag_trigger and not kees_trigger:
        return

    tekst = msg.text.replace(f'@{bot_username}', '').strip() or "Hallo"
    log.info(f"Reactie getriggerd ({naam}): {tekst}")

    # Spontane triggers krijgen een willekeurige vertraging (menselijker)
    vertraging = 0 if direct_mention else random.randint(8, 45)
    if vertraging:
        await asyncio.sleep(vertraging)

    try:
        stop_event = asyncio.Event()
        typing_task = asyncio.create_task(keep_typing(context.bot, msg.chat_id, stop_event))

        reply, _ = await asyncio.gather(
            asyncio.get_event_loop().run_in_executor(None, ai_kees_reply, naam, tekst),
            asyncio.sleep(2),
        )

        stop_event.set()
        await typing_task
        await msg.reply_text(reply)
        geschiedenis.append(f"AI Kees: {reply}")
        log.info(f"AI Kees antwoordde: {reply}")
    except Exception as e:
        log.error(f"Fout bij mention-reactie: {e}")


async def post_message(text: str):
    """Stuur een bericht naar de groep — aangeroepen door update_agent.py."""
    bot = Bot(token=BOT_TOKEN)
    await bot.send_message(chat_id=CHAT_ID, text=text)
    log.info(f"Gepost: {text}")


def main():
    if not BOT_TOKEN or not API_KEY:
        log.error("BOT_TOKEN of ANTHROPIC_API_KEY ontbreekt in .env")
        sys.exit(1)

    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(MessageHandler(
        filters.TEXT & filters.Chat(CHAT_ID),
        handle_message,
    ))
    log.info("AI Kees is online — wacht op @mentions")
    app.run_polling(drop_pending_updates=True)


if __name__ == '__main__':
    main()
