#!/usr/bin/env python3
"""Tempetoto 2026 — Excel invulformulier generator"""

import openpyxl
from openpyxl.styles import PatternFill, Font, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter

# ─── Data (zelfde als data.js) ────────────────────────────────────────────────

GROUPS = {
    'A': ["Mexico","Zuid-Afrika","Zuid-Korea","Tsjechië"],
    'B': ["Canada","Zwitserland","Qatar","Bosnië-Herzegovina"],
    'C': ["Brazilië","Marokko","Haïti","Schotland"],
    'D': ["Verenigde Staten","Paraguay","Australië","Turkije"],
    'E': ["Duitsland","Curaçao","Ivoorkust","Ecuador"],
    'F': ["Nederland","Japan","Zweden","Tunesië"],
    'G': ["België","Egypte","Iran","Nieuw-Zeeland"],
    'H': ["Spanje","Kaapverdië","Saoedi-Arabië","Uruguay"],
    'I': ["Frankrijk","Senegal","Noorwegen","Irak"],
    'J': ["Argentinië","Algerije","Oostenrijk","Jordanië"],
    'K': ["Portugal","DR Congo","Oezbekistan","Colombia"],
    'L': ["Engeland","Kroatië","Ghana","Panama"],
}

TEAMCOLORS = {
    "Mexico":"006847","Zuid-Afrika":"ffb612","Zuid-Korea":"cd2e3a","Tsjechië":"11457e",
    "Canada":"ff0000","Zwitserland":"555555","Qatar":"8a1538","Bosnië-Herzegovina":"002395",
    "Brazilië":"009c3b","Marokko":"c1272d","Haïti":"00209f","Schotland":"5fb0e5",
    "Verenigde Staten":"3c3b6e","Paraguay":"d52b1e","Australië":"ffcd00","Turkije":"444444",
    "Duitsland":"444444","Curaçao":"002b7f","Ivoorkust":"f77f00","Ecuador":"ed1c24",
    "Nederland":"ff6a13","Japan":"bc002d","Zweden":"006aa7","Tunesië":"444444",
    "België":"fdda24","Egypte":"ce1126","Iran":"239f40","Nieuw-Zeeland":"00247d",
    "Spanje":"aa151b","Kaapverdië":"003893","Saoedi-Arabië":"006c35","Uruguay":"5b92e5",
    "Frankrijk":"0055a4","Senegal":"00853f","Noorwegen":"ba0c2f","Irak":"444444",
    "Argentinië":"74acdf","Algerije":"006233","Oostenrijk":"ed2939","Jordanië":"444444",
    "Portugal":"006600","DR Congo":"00aaff","Oezbekistan":"1eb53a","Colombia":"fcd116",
    "Engeland":"ce1124","Kroatië":"1742a0","Ghana":"ffd100","Panama":"444444",
}

RR_PAIRS = [[0,1],[2,3],[0,2],[3,1],[3,0],[1,2]]

FAVORIETEN = ["Frankrijk","Spanje","Argentinië","Engeland","Portugal","Brazilië",
              "Nederland","Marokko","België","Duitsland","Kroatië","Colombia"]

DEELNEMERS = ["EJ","Floris","Gautier","Giezen","Huttenhuis","Mark","Pieter","Slotboom","Smit","AI Kees"]

ALL_TEAMS  = [t for teams in GROUPS.values() for t in teams]
OUTSIDERS  = sorted([t for t in ALL_TEAMS if t not in FAVORIETEN])

def build_group_matches():
    matches = []
    for g, teams in GROUPS.items():
        for n, (a, b) in enumerate(RR_PAIRS, 1):
            matches.append({'id': f'{g}{n}', 'group': g, 'home': teams[a], 'away': teams[b]})
    return matches

GROUP_MATCHES = build_group_matches()

# ─── Stijlen ──────────────────────────────────────────────────────────────────

FILL_INPUT  = PatternFill("solid", fgColor="BCD2EC")
FILL_HEADER = PatternFill("solid", fgColor="2F6DB5")
FILL_GRPHDR = PatternFill("solid", fgColor="DDE6F3")

FONT_TITLE  = Font(name="Calibri", bold=True,   color="0A1F47", size=15)
FONT_HEADER = Font(name="Calibri", bold=True,   color="FFFFFF", size=10)
FONT_GRPHDR = Font(name="Calibri", bold=True,   color="1C3F7A", size=10)
FONT_LABEL  = Font(name="Calibri", bold=True,   color="1C3F7A", size=10)
FONT_INPUT  = Font(name="Calibri", bold=True,   color="0A2A55", size=10)
FONT_TEAM   = Font(name="Calibri",              color="111111", size=10)
FONT_NOTE   = Font(name="Calibri", italic=True, color="888888", size=9)

def _side(style, color): return Side(style=style, color=color)

BORDER_THIN = Border(
    left=_side('thin','AABBCC'), right=_side('thin','AABBCC'),
    top=_side('thin','AABBCC'),  bottom=_side('thin','AABBCC'))
BORDER_INPUT = Border(
    left=_side('medium','2A5298'), right=_side('medium','2A5298'),
    top=_side('medium','2A5298'),  bottom=_side('medium','2A5298'))

CENTER = Alignment(horizontal='center', vertical='center')
RIGHT  = Alignment(horizontal='right',  vertical='center')
LEFT   = Alignment(horizontal='left',   vertical='center')

# ─── Layout: 11 kolommen A–K ─────────────────────────────────────────────────
# A=klrblok, B=thuisteam, C=klrblok, D=uitteam, E=SCORE_INPUT, F=spacer,
# G=klrblok, H=thuisteam, I=klrblok, J=uitteam, K=SCORE_INPUT

CLR1, TEAM1, CLR2, TEAM2, SCORE1 = 1, 2, 3, 4, 5   # A B C D E
SPC                                = 6               # F
CLR3, TEAM3, CLR4, TEAM4, SCORE2  = 7, 8, 9, 10, 11 # G H I J K
NCOLS = 11

COL_WIDTHS = {1:3.5, 2:20, 3:3.5, 4:20, 5:10,
              6:2.5,
              7:3.5, 8:20, 9:3.5, 10:20, 11:10}

# ─── Helpers ──────────────────────────────────────────────────────────────────

def set_widths(ws):
    for col, w in COL_WIDTHS.items():
        ws.column_dimensions[get_column_letter(col)].width = w

def cc(ws, row, col):
    return ws.cell(row=row, column=col)

def merge_row(ws, row, c1, c2):
    if c1 != c2:
        ws.merge_cells(start_row=row, start_column=c1, end_row=row, end_column=c2)
    return ws.cell(row=row, column=c1)

def section_hdr(ws, row, text):
    cell = merge_row(ws, row, 1, NCOLS)
    cell.value = text
    cell.font = FONT_HEADER
    cell.fill = FILL_HEADER
    cell.alignment = LEFT
    ws.row_dimensions[row].height = 18

def lbl(ws, row, c1, c2, text):
    cell = merge_row(ws, row, c1, c2)
    cell.value = text
    cell.font = FONT_LABEL
    cell.alignment = RIGHT

def inp(ws, row, col, formula1=None):
    cell = ws.cell(row=row, column=col)
    cell.fill = FILL_INPUT
    cell.font = FONT_INPUT
    cell.border = BORDER_INPUT
    cell.alignment = CENTER
    if formula1:
        dv = DataValidation(type="list", formula1=formula1, allow_blank=True)
        ws.add_data_validation(dv)
        dv.add(cell)
    return cell

def team_clr(ws, row, col, team):
    cell = ws.cell(row=row, column=col)
    cell.fill = PatternFill("solid", fgColor=TEAMCOLORS.get(team, "cccccc"))
    cell.border = BORDER_THIN

def team_name(ws, row, col, name, align=LEFT):
    cell = ws.cell(row=row, column=col)
    cell.value = name
    cell.font = FONT_TEAM
    cell.border = BORDER_THIN
    cell.alignment = align

# ─── Sheet per deelnemer ──────────────────────────────────────────────────────

def build_sheet(ws, naam, l_sheet):
    set_widths(ws)
    ws.sheet_view.showGridLines = False
    row = 1

    # Titel
    cell = merge_row(ws, row, 1, NCOLS)
    cell.value = f"TEMPETOTO 2026  —  {naam}"
    cell.font = FONT_TITLE
    cell.alignment = LEFT
    ws.row_dimensions[row].height = 26
    row += 2

    # ── Vooraf invullen ────────────────────────────────────────────────────────
    section_hdr(ws, row, "VOORAF INVULLEN  ·  deadline vóór de eerste wedstrijd")
    row += 1

    all_f   = f"={l_sheet}!$A$1:$A${len(ALL_TEAMS)}"
    out_f   = f"={l_sheet}!$B$1:$B${len(OUTSIDERS)}"
    fav_f   = f"={l_sheet}!$C$1:$C${len(FAVORIETEN)}"

    for lbl_text, formula in [
        ("Kampioen:",                           all_f),
        ("Verrassing  (outsider, buiten top-12):", out_f),
        ("Deceptie  (favoriet, top-12):",       fav_f),
        ("Topscorer  (naam speler):",            None),
        ("Topscorer  (verwacht aantal goals):",  None),
        ("Totaal goals  (heel WK):",             None),
        ("Gele kaarten totaal WK:",              None),
        ("Rode kaarten totaal WK:",              None),
    ]:
        lbl(ws, row, 1, 4, lbl_text)
        inp(ws, row, SCORE1, formula)
        ws.row_dimensions[row].height = 18
        row += 1
    row += 1

    # ── Groepswedstrijden ──────────────────────────────────────────────────────
    section_hdr(ws, row,
        "GROEPSWEDSTRIJDEN  ·  vul uitslag in als bijv.  2-1  (thuis – uit, na 90 min)")
    row += 1

    group_keys = list(GROUPS.keys())
    for i in range(0, 12, 2):
        gl, gr = group_keys[i], group_keys[i+1]
        ml = [m for m in GROUP_MATCHES if m['group'] == gl]
        mr = [m for m in GROUP_MATCHES if m['group'] == gr]

        # groepkoprij
        cell_l = merge_row(ws, row, CLR1, SCORE1)
        cell_l.value = f"Groep {gl}"
        cell_l.font = FONT_GRPHDR; cell_l.fill = FILL_GRPHDR; cell_l.alignment = CENTER
        cell_r = merge_row(ws, row, CLR3, SCORE2)
        cell_r.value = f"Groep {gr}"
        cell_r.font = FONT_GRPHDR; cell_r.fill = FILL_GRPHDR; cell_r.alignment = CENTER
        ws.row_dimensions[row].height = 16
        row += 1

        # 6 wedstrijden per groep
        for k in range(6):
            team_clr(ws, row, CLR1,  ml[k]['home'])
            team_name(ws, row, TEAM1, ml[k]['home'])
            team_clr(ws, row, CLR2,  ml[k]['away'])
            team_name(ws, row, TEAM2, ml[k]['away'], RIGHT)
            inp(ws, row, SCORE1)

            team_clr(ws, row, CLR3,  mr[k]['home'])
            team_name(ws, row, TEAM3, mr[k]['home'])
            team_clr(ws, row, CLR4,  mr[k]['away'])
            team_name(ws, row, TEAM4, mr[k]['away'], RIGHT)
            inp(ws, row, SCORE2)

            ws.row_dimensions[row].height = 17
            row += 1

        # Groepswinnaar + Runner-up
        fl = '"' + ','.join(GROUPS[gl]) + '"'
        fr = '"' + ','.join(GROUPS[gr]) + '"'
        for advance_lbl in ["Groepswinnaar:", "Runner-up:"]:
            lbl(ws, row, 1, 4, advance_lbl)
            inp(ws, row, SCORE1, fl)
            lbl(ws, row, 7, 10, advance_lbl)
            inp(ws, row, SCORE2, fr)
            ws.row_dimensions[row].height = 18
            row += 1
        row += 1

    # ── Beste 8 nummers 3 ─────────────────────────────────────────────────────
    section_hdr(ws, row,
        "BESTE 8 NUMMERS 3  ·  8 landen als beste nummer 3 (3 pt per goed voorspeld land)")
    row += 1

    for i in range(4):
        lbl(ws, row, 1,  4,  f"{i+1}.")
        inp(ws, row, SCORE1, all_f)
        lbl(ws, row, 7,  10, f"{i+5}.")
        inp(ws, row, SCORE2, all_f)
        ws.row_dimensions[row].height = 18
        row += 1
    row += 1

    # ── Knock-out notitie ─────────────────────────────────────────────────────
    cell = merge_row(ws, row, 1, NCOLS)
    cell.value = "ℹ  Knock-out voorspellingen vul je in ná de groepsfase — dit blad wordt later aangevuld."
    cell.font = FONT_NOTE
    cell.alignment = LEFT
    ws.row_dimensions[row].height = 16

# ─── Hidden 'Landen' sheet voor dropdowns ────────────────────────────────────

def build_landen_sheet(ws):
    ws.title = "Landen"
    ws.sheet_state = "hidden"
    for i, t in enumerate(ALL_TEAMS, 1):
        ws.cell(i, 1).value = t   # A: alle landen
    for i, t in enumerate(OUTSIDERS, 1):
        ws.cell(i, 2).value = t   # B: outsiders (buiten top-12)
    for i, t in enumerate(FAVORIETEN, 1):
        ws.cell(i, 3).value = t   # C: favorieten (top-12)

# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    wb = openpyxl.Workbook()

    landen_ws = wb.active
    build_landen_sheet(landen_ws)

    for naam in DEELNEMERS:
        ws = wb.create_sheet(title=naam)
        build_sheet(ws, naam, "Landen")

    path = "/home/floris/Tempetoto/tempetoto2026_invulformulier.xlsx"
    wb.save(path)
    print(f"Opgeslagen: {path}")
    for sh in wb.sheetnames:
        marker = " (verborgen)" if sh == "Landen" else ""
        print(f"  · {sh}{marker}")

if __name__ == "__main__":
    main()
