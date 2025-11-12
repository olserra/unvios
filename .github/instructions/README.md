# GitHub Instructions - Navigation Guide

This folder contains specialized documentation for AI coding assistants and developers working on Unvios.

## File Structure

```
.github/
├── copilot-instructions.md          # Main entry point - read this first
└── instructions/
    ├── architecture.md              # Design patterns, folder structure
    ├── backend-guide.md             # API routes, database, auth
    ├── frontend-guide.md            # UI components, client patterns
    ├── environment.md               # Environment variables reference
    ├── workflows.md                 # Development commands & scripts
    ├── testing.md                   # Testing & quality assurance
    ├── contributing.md              # Code style & conventions
    └── business-context.md          # Market analysis & product vision
```

## Quick Navigation

### Getting Started
1. Start with `copilot-instructions.md` for orientation
2. Check `environment.md` to set up your `.env.local`
3. Follow `workflows.md` for initial setup commands

### Working on Features
- **Backend work** → `backend-guide.md`
- **Frontend work** → `frontend-guide.md`
- **Architecture questions** → `architecture.md`

### Daily Development
- **Commands** → `workflows.md`
- **Code style** → `contributing.md`
- **Testing** → `testing.md`

### Business Context
- **Product vision** → `business-context.md`

## For AI Assistants

### Context Loading Priority
GitHub Copilot loads files in this order:
1. `copilot-instructions.md` (always loaded)
2. Files in `instructions/` based on query context
3. Closest match to current work

### Best Practices
- **Backend questions** → Load `backend-guide.md`
- **Frontend questions** → Load `frontend-guide.md`
- **Setup questions** → Load `environment.md` + `workflows.md`
- **Code style questions** → Load `contributing.md`
- **Architecture decisions** → Load `architecture.md` + create ADR

## Document Summaries

### copilot-instructions.md (77 lines)
Quick orientation, critical rules, references to specialized guides.

### architecture.md (~200 lines)
- Folder structure
- 10 design patterns in use
- Architectural decisions
- Code organization conventions
- Performance patterns

### backend-guide.md (~350 lines)
- API route specifications
- Database schema & queries
- Authentication flows
- External service integration
- Vector operations
- Error handling patterns

### frontend-guide.md (~200 lines)
- Component structure
- Memory UI components
- Tag handling
- API contracts
- Client-server integration
- Data shapes

### environment.md (~180 lines)
- Required variables (POSTGRES_URL, AUTH_SECRET)
- Optional services (LLM, embeddings)
- Development flags
- Example .env.local
- Validation checklist

### workflows.md (~280 lines)
- Daily development commands
- Database workflows (setup, migrate, seed)
- Testing workflows
- Building & production
- Utility scripts
- Common workflows
- Troubleshooting

### testing.md (~350 lines)
- Type safety with TypeScript
- Runtime validation with Zod
- Manual testing workflows
- Script-based testing
- Code quality tools
- Security testing
- Performance testing
- Debugging tips

### contributing.md (~380 lines)
- Code style requirements
- File naming conventions
- TypeScript conventions
- React patterns (Server vs Client)
- API route patterns
- Database patterns
- Git workflow
- PR guidelines
- ADR process

### business-context.md (~500 lines)
- Market analysis
- Competitive landscape
- Target market segments
- Pricing strategy
- Go-to-market plan
- Revenue projections

## Maintenance

### When to Update

**Add new env var** → Update `environment.md`

**Add new API route** → Update `backend-guide.md`

**Add new component** → Update `frontend-guide.md`

**Change architecture** → Update `architecture.md` + create ADR in `docs/adr/`

**New workflow** → Update `workflows.md`

**Change code style** → Update `contributing.md`

### Keep Files Focused
- Each file should be 200-500 lines max
- Split into new file if growing too large
- Update this README when adding files

## For Human Developers

This documentation structure is optimized for AI assistants but useful for humans too:

**Quick reference** → `copilot-instructions.md`

**Deep dive** → Specific guide in `instructions/`

**Understanding decisions** → ADRs in `docs/adr/`

## Contributing to Documentation

1. **Keep language simple** - AI assistants prefer concise, actionable text
2. **Use examples** - Show code snippets, not just descriptions
3. **Update cross-references** - Link between related guides
4. **Maintain consistency** - Follow existing format patterns
5. **Test with AI** - Ask Copilot questions to verify docs are helpful

## File Size Guidelines

Optimal for AI context loading:
- Main instructions: 50-100 lines
- Specialized guides: 200-500 lines
- Reference docs: up to 500 lines

Split larger topics into multiple focused files.
