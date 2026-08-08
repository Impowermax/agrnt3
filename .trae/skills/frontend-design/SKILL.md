---
name: "frontend-design"
description: "Assists with frontend UI/UX design, visual styling, layout, and design systems. Invoke when user asks for UI design, page styling, component design, design specifications, or wants to improve the visual appearance of web pages."
---

# Frontend Design

This skill provides guidance and assistance for frontend design tasks, including UI/UX design, visual styling, layout optimization, and design system creation.

## When to Use

**Invoke this skill when:**
- User asks for UI/UX design help
- User wants to style or restyle web pages
- User requests component design
- User wants to create or follow design specifications
- User asks about color schemes, typography, spacing systems
- User wants to improve visual appearance of frontend code
- User mentions "设计规范" (design specifications) or design-related terms
- User wants to build consistent design systems

## Design Principles

### 1. Visual Hierarchy
- Use size, color, and spacing to guide user attention
- Primary actions should be visually prominent
- Secondary information should recede but remain accessible

### 2. Consistency
- Follow established design patterns and specifications
- Maintain consistent spacing, colors, and typography
- Reuse components rather than creating variations

### 3. Accessibility
- Ensure sufficient color contrast (WCAG AA minimum)
- Provide clear focus states for keyboard navigation
- Use semantic HTML to support screen readers

### 4. Responsive Design
- Design mobile-first, then scale up
- Use flexible layouts (flexbox, grid)
- Test across breakpoints

## Design Tokens

When working with design systems, use consistent tokens:

```css
:root {
  /* Colors */
  --color-primary: #1890ff;
  --color-success: #52c41a;
  --color-warning: #faad14;
  --color-error: #f5222d;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Typography */
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 20px;
  
  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  
  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.15);
}
```

## Workflow

1. **Understand Requirements**: Clarify design goals, target users, and constraints
2. **Review Existing Design Specs**: Check for design documents (e.g., 设计规范.docx) in the project
3. **Propose Design Approach**: Suggest layouts, color schemes, component styles
4. **Implement**: Apply styles using CSS/SCSS, respecting existing design tokens
5. **Validate**: Check responsiveness, accessibility, and consistency

## Component Design Guidelines

### Buttons
- Clear hover/active/disabled states
- Consistent padding and border-radius
- Meaningful color usage (primary, danger, ghost)

### Forms
- Clear labels and validation messages
- Adequate input sizes for touch targets
- Logical tab order

### Cards
- Consistent padding and shadows
- Clear content hierarchy
- Meaningful hover states when interactive

### Navigation
- Clear active state indicators
- Accessible keyboard navigation
- Responsive collapse on mobile

## Image Resources

When generating image resources for web pages (e.g., `<img>`, product images, section illustrations), use the approved image source:

```
https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt={prompt}&image_size={image_size}
```

Where:
- `{prompt}` must be URL-encoded, following SDXL best practices, describing a concrete realistic visual
- `{image_size}` ∈ square_hd | square | portrait_4_3 | portrait_16_9 | landscape_4_3 | landscape_16_9

**Placeholder images are strictly forbidden.**

## Best Practices

- Prefer editing existing styles over creating new ones
- Respect the project's existing design language
- Keep CSS modular and maintainable
- Use semantic class names
- Avoid inline styles unless dynamic
- Document design decisions when non-obvious
