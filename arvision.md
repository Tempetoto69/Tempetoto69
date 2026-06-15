# Tempetoto Architectural Vision

## Core Philosophy
- **Loop-First Design**: All data transformations and calculations use iterative patterns
- **Predictable State Flow**: Clear input → processing → output pipelines
- **Modular Scoring**: Each tournament phase has isolated scoring logic

## Key Principles
1. **Consistent Data Structures**: Uniform match/prediction/result objects
2. **Composable Functions**: Small, testable functions that can be chained
3. **Phase Independence**: Group stage, knockout, and special predictions handled separately

## Success Metrics
- All scoring calculations complete in O(n) time
- Zero hardcoded tournament-specific logic
- 100% test coverage for scoring rules
