# Changelog (English)

This document records all version updates for **MCP Feedback Enhanced**.

---

## [v2.2.1] - Window Optimization & Unified Settings Interface (2024-12-XX)

### 🌟 Highlights
This release primarily addresses GUI window size constraints, implements smart window state saving mechanisms, and optimizes the unified settings interface.

### 🚀 Improvements
- 🖥️ **Window Size Constraint Removal**: Removed GUI main window minimum size limit from 1000×800 to 400×300, allowing users to freely adjust window size for different use cases
- 💾 **Real-time Window State Saving**: Implemented real-time saving mechanism for window size and position changes, with debounce delay to avoid excessive I/O operations
- ⚙️ **Unified Settings Interface Optimization**: Improved GUI settings page configuration saving logic to avoid setting conflicts, ensuring correct window positioning and size settings
- 🎯 **Smart Window Size Saving**: In "Always center display" mode, correctly saves window size (but not position); in "Smart positioning" mode, saves complete window state

### 🐛 Bug Fixes
- 🔧 **Window Size Constraint**: Fixed GUI window unable to resize to small dimensions issue (fixes #10 part one)
- 🛡️ **Setting Conflicts**: Fixed potential configuration conflicts during settings save operations

---

## [v2.2.0] - Layout & Settings UI Enhancements (2024-12-XX)

### 🌟 Highlights
This version adds horizontal layout options, optimizes the settings interface, and fixes shortcut keys and image pasting issues.

### ✨ New Features
- 🎨 **Horizontal Layout Mode**: Added a left-right layout (horizontal split) option for summary and feedback in the combined mode for both GUI and Web UI, offering more flexible viewing (fulfills [Issue #1](https://github.com/Minidoracat/mcp-feedback-enhanced/issues/1))

### 🚀 Improvements
- 🎨 **Improved Settings Interface**: Optimized the settings page for both GUI and Web UI, enhancing layout clarity and user experience
- ⌨️ **GUI Shortcut Enhancement**: The submit feedback shortcut (Ctrl+Enter / Cmd+Enter) now fully supports the Enter key on the numeric keypad (numpad)

### 🐛 Bug Fixes
- 🔧 **Image Duplication Fix (Web UI)**: Resolved an issue where pasting images using Ctrl+V in the text input area could lead to duplicate image pasting

---

## [v2.1.1] - Window Positioning Optimization (2024-11-XX)

### 🌟 Highlights
Perfect solution for window positioning issues in multi-monitor environments, especially T-shaped screen arrangements and other complex configurations.

### ✨ New Features
- 🖥️ **Smart Window Positioning**: Added "Always show window at primary screen center" setting option
- 🌐 **Multi-Monitor Support**: Perfect solution for complex multi-monitor setups like T-shaped screen arrangements
- 💾 **Position Memory**: Auto-save and restore window position with intelligent visibility detection
- ⚙️ **User Choice**: Provides smart positioning (default) and forced center display modes

---

## [v2.1.0] - Complete Refactored Version (2024-11-XX)

### 🌟 Highlights
This is a major refactoring version where both GUI and Web UI adopt brand new modular architecture.

### 🎨 Major Refactoring
- 🏗️ **Complete Refactoring**: GUI and Web UI adopt modular architecture
- 📁 **Centralized Management**: Reorganized folder structure, improved maintainability
- 🖥️ **Interface Optimization**: Modern design and improved user experience

### ✨ New Features
- 🍎 **macOS Interface Optimization**: Specialized improvements for macOS user experience
- ⚙️ **Feature Enhancement**: New settings options and auto-close page functionality
- ℹ️ **About Page**: Added about page with version info, project links, and acknowledgments

### 🐛 Bug Fixes
- 🌐 **Language Switching**: Fixed Web UI content update issues when switching languages

---

## [v2.0.14] - Shortcut & Image Feature Enhancement (2024-10-XX)

### 🚀 Improvements
- ⌨️ **Enhanced Shortcuts**: Ctrl+Enter supports numpad
- 🖼️ **Smart Image Pasting**: Ctrl+V directly pastes clipboard images

---

## [v2.0.9] - Multi-language Architecture Refactor (2024-10-XX)

### 🔄 Refactoring
- 🌏 **Multi-language Architecture Refactor**: Support for dynamic loading
- 📁 **Modularized Language Files**: Modular organization of language files

---

## [v2.0.3] - Encoding Issues Fix (2024-10-XX)

### 🐛 Critical Fixes
- 🛡️ **Complete Chinese Character Encoding Fix**: Resolved all Chinese display related issues
- 🔧 **JSON Parsing Error Fix**: Fixed data parsing errors

---

## [v2.0.0] - Web UI Support (2024-09-XX)

### 🌟 Major Features
- ✅ **Added Web UI Support**: Support for remote environments
- ✅ **Auto Environment Detection**: Automatically choose appropriate interface
- ✅ **WebSocket Real-time Communication**: Real-time bidirectional communication

---

## Legend

| Icon | Meaning |
|------|---------|
| 🌟 | Version Highlights |
| ✨ | New Features |
| 🚀 | Improvements |
| 🐛 | Bug Fixes |
| 🔄 | Refactoring Changes |
| 🎨 | UI Optimization |
| ⚙️ | Settings Related |
| 🖥️ | Window Related |
| 🌐 | Multi-language/Network Related |
| 📁 | File Structure |
| ⌨️ | Shortcuts |
| 🖼️ | Image Features |

---

**Full Project Info:** [GitHub - mcp-feedback-enhanced](https://github.com/Minidoracat/mcp-feedback-enhanced) 