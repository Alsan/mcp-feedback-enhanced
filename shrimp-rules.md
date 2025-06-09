# 開發守則

## 專案概述

### 核心定位
- **MCP 服務器專案** - 基於 Model Context Protocol 的互動式回饋增強服務
- **多環境支援** - 本地、SSH Remote、WSL 環境完整支援
- **Web UI 架構** - 現代化響應式網頁介面，支援圖片上傳與多語言
- **Python 模組化設計** - fastmcp + FastAPI + WebSocket 技術棧

### 技術棧識別
- **核心框架**: fastmcp (>=2.0.0), FastAPI (>=0.115.0), WebSocket
- **前端技術**: Jinja2 模板引擎, HTML/CSS/JavaScript, Bootstrap
- **多語言**: i18n 系統支援 en/zh-CN/zh-TW
- **建構工具**: pyproject.toml, uv 包管理器

## 專案架構規範

### 目錄結構邏輯
```
src/mcp_feedback_enhanced/     # 主要源碼模組
├── server.py                  # MCP 服務器主程式
├── __main__.py               # 程式入口點
├── i18n.py                   # 國際化處理
├── web/                      # 網頁應用模組
│   ├── main.py              # FastAPI 主應用
│   ├── routes/              # API 路由
│   ├── templates/           # Jinja2 模板
│   ├── static/              # 靜態資源
│   ├── locales/             # 多語言檔案
│   └── utils/               # Web 工具函數
├── testing/                 # 測試相關工具
└── utils/                   # 通用工具函數
```

### 模組職責分工
- **server.py**: MCP 協議實作，工具函數註冊
- **web/main.py**: FastAPI 應用，WebSocket 管理，環境檢測
- **i18n.py**: 語言檢測，翻譯管理，本地化邏輯
- **testing/**: 測試腳本，模擬工具，驗證邏輯

## 多語言文件同步規範

### **🚨 強制同步規則**

#### README 文件三語同步
- **修改 `README.md`** → 必須同步修改 `README.zh-CN.md` 和 `README.zh-TW.md`
- **修改 `README.zh-CN.md`** → 必須同步修改 `README.md` 和 `README.zh-TW.md`  
- **修改 `README.zh-TW.md`** → 必須同步修改 `README.md` 和 `README.zh-CN.md`

#### 文檔目錄三語同步
- **修改 `docs/en/`** → 必須同步修改 `docs/zh-CN/` 和 `docs/zh-TW/`
- **修改 `docs/zh-CN/`** → 必須同步修改 `docs/en/` 和 `docs/zh-TW/`
- **修改 `docs/zh-TW/`** → 必須同步修改 `docs/en/` 和 `docs/zh-CN/`

#### 版本更新記錄同步
- **修改 `RELEASE_NOTES/CHANGELOG.en.md`** → 必須同步更新對應的中文版本記錄
- **版本號變更** → 必須同步更新 `pyproject.toml` 中的 version 欄位

#### Web 本地化資源同步
- **修改 `src/mcp_feedback_enhanced/web/locales/en/`** → 必須同步修改 `zh-CN/` 和 `zh-TW/`
- **新增翻譯鍵值** → 必須在三種語言的本地化檔案中都提供對應翻譯
- **模板文字變更** → 必須檢查是否影響 i18n 鍵值，如有影響需同步更新

### 語言對應標準
- **en** = English (英文)
- **zh-CN** = Simplified Chinese (简体中文)  
- **zh-TW** = Traditional Chinese (繁體中文)

## 代碼規範

### Python 代碼風格
- **類別命名**: PascalCase (例: `FeedbackServer`)
- **函數命名**: snake_case (例: `handle_feedback`)
- **常數命名**: UPPER_SNAKE_CASE (例: `DEFAULT_PORT`)
- **私有成員**: 單底線前綴 (例: `_internal_method`)

### Web 前端規範
- **HTML 模板**: 使用 Jinja2 語法，模板檔案放置於 `web/templates/`
- **CSS 類別**: kebab-case (例: `feedback-container`)
- **JavaScript 函數**: camelCase (例: `handleSubmit`)
- **國際化標記**: 使用 `{{ _('translation_key') }}` 格式

### 檔案命名規範
- **Python 模組**: snake_case.py (例: `test_web_ui.py`)
- **HTML 模板**: kebab-case.html (例: `feedback-form.html`)
- **CSS 檔案**: kebab-case.css (例: `main-styles.css`)
- **JavaScript 檔案**: kebab-case.js (例: `websocket-handler.js`)

## 功能實作規範

### MCP 工具函數實作
- **必須註冊**: 所有工具函數必須在 `server.py` 中使用 `@server.tool()` 裝飾器註冊
- **參數型別**: 使用 `annotated-types` 進行參數驗證
- **錯誤處理**: 必須捕獲並適當處理異常，返回有意義的錯誤訊息
- **文檔字串**: 每個工具函數必須提供清晰的 docstring 說明用途和參數

### Web UI 功能實作
- **路由定義**: API 路由放置於 `web/routes/` 目錄，依功能分類
- **WebSocket 處理**: 連線管理邏輯統一在 `web/main.py` 中實作
- **環境檢測**: 必須支援本地、SSH Remote、WSL 三種環境的自動檢測
- **圖片處理**: 支援 PNG/JPG/JPEG/GIF/BMP/WebP 格式，自動壓縮至 1MB 以下

### 測試規範
- **測試檔案**: 對應源碼檔案，加上 `test_` 前綴 (例: `test_web_ui.py`)
- **測試覆蓋**: 每個公開函數都必須有對應測試案例
- **模擬環境**: 使用 `testing/` 目錄中的工具進行環境模擬
- **異步測試**: 使用 `pytest-asyncio` 進行異步函數測試

## 框架與依賴使用規範

### FastMCP 框架使用
- **服務器初始化**: 使用 `fastmcp.Server()` 建立服務器實例
- **工具註冊**: 使用 `@server.tool()` 裝飾器註冊工具
- **執行模式**: 支援 stdio 和 sse 兩種傳輸模式

### FastAPI 整合規範
- **應用實例**: Web 應用實例定義在 `web/main.py`
- **中介軟體**: 必須設定 CORS 中介軟體支援跨域請求
- **靜態檔案**: 使用 `StaticFiles` 提供 `/static` 路徑服務
- **模板引擎**: 使用 `Jinja2Templates` 處理 HTML 模板渲染

### WebSocket 管理
- **連線池**: 維護活動連線列表，支援多客戶端連線
- **訊息格式**: 使用 JSON 格式進行 WebSocket 通訊
- **心跳檢測**: 實作定期 ping/pong 機制確保連線穩定性
- **錯誤恢復**: 實作自動重連邏輯，處理網路中斷情況

## 工作流程規範

### 開發工作流程
1. **功能開發** → 修改源碼 → 更新測試 → 運行測試套件
2. **文檔更新** → 同步修改三語文檔 → 檢查連結有效性
3. **版本發布** → 更新版本號 → 更新 CHANGELOG → 測試完整功能
4. **多語言更新** → 更新翻譯鍵值 → 同步三語本地化檔案

### 測試工作流程
```bash
# 標準測試流程
uv run python -m mcp_feedback_enhanced test        # 基本功能測試
uv run python -m mcp_feedback_enhanced test --web  # Web UI 測試
uv run python -m mcp_feedback_enhanced test --enhanced # 完整測試套件
```

### 環境檢測流程
1. **系統檢測** → 識別作業系統 (Windows/Linux/macOS)
2. **環境判斷** → 檢測 SSH_CLIENT/WSL 環境變數
3. **瀏覽器啟動** → 根據環境選擇適當的啟動方式
4. **錯誤處理** → 提供環境特定的解決方案指引

## 關鍵檔案交互規範

### 版本管理檔案連動
- **修改 `pyproject.toml` version** → 必須同步檢查並更新:
  - `src/mcp_feedback_enhanced/__init__.py` 中的 `__version__`
  - `RELEASE_NOTES/` 目錄下的對應版本記錄
  - README 文件中的版本參考

### 配置檔案管理
- **修改預設配置** → 必須同步更新:
  - `src/mcp_feedback_enhanced/__main__.py` 中的預設值
  - README 文件中的配置說明
  - 測試檔案中的配置模擬

### 模板與本地化連動
- **修改 HTML 模板** → 檢查並更新:
  - `web/locales/` 中對應的翻譯鍵值
  - `i18n.py` 中的語言檢測邏輯
  - CSS/JavaScript 檔案中的對應功能

### 路由與靜態資源連動
- **新增 API 路由** → 必須同步:
  - 在 `web/main.py` 中註冊路由
  - 更新前端 JavaScript 的 API 呼叫
  - 新增對應的測試案例

## AI 決策規範

### 優先級判斷標準
1. **安全性優先** - 任何涉及安全性的修改必須優先考慮
2. **多語言一致性** - 確保三種語言版本功能和內容一致
3. **向後兼容性** - 新功能不應破壞現有的 MCP 整合
4. **跨平台兼容** - 修改必須同時考慮 Windows/Linux/macOS 環境

### 模糊情況處理決策樹
```
環境相關問題:
├── SSH Remote 環境 → 提供瀏覽器手動啟動指引
├── WSL 環境 → 使用 Windows 瀏覽器啟動方案  
├── 本地環境 → 直接啟動系統預設瀏覽器
└── 未知環境 → 使用 Web UI 作為備用方案

多語言處理:
├── 新增功能 → 必須提供三語支援
├── 修改文案 → 必須同步更新三語版本
├── 錯誤訊息 → 必須國際化處理
└── 使用者介面 → 支援即時語言切換

版本控制:
├── 主要功能更新 → 提升 minor 版本號
├── 重大架構變更 → 提升 major 版本號  
├── 錯誤修正 → 提升 patch 版本號
└── 文檔更新 → 不變更版本號
```

### 錯誤處理決策原則
- **網路連線問題** → 提供重試機制與手動解決方案
- **瀏覽器啟動失敗** → 根據環境提供特定解決指引
- **WebSocket 中斷** → 自動重連並通知使用者
- **檔案讀取錯誤** → 提供詳細錯誤訊息與修復建議

## 禁止事項

### **🚫 絕對禁止**

#### 多語言文件管理
- **禁止單獨修改任一語言的 README** - 必須同步更新三種語言版本
- **禁止使用機器翻譯進行粗略翻譯** - 必須確保翻譯品質和專業用詞
- **禁止破壞現有的 i18n 鍵值結構** - 新增或修改必須保持一致性
- **禁止在程式碼中硬編碼特定語言文字** - 必須使用 i18n 系統

#### 架構與相容性
- **禁止修改 MCP 協議的核心實作** - 避免破壞與 MCP 客戶端的兼容性
- **禁止移除環境檢測功能** - 必須保持多環境支援能力
- **禁止破壞 WebSocket 連線機制** - 避免影響即時通訊功能
- **禁止修改預設 port 8765** - 除非有明確需求並更新所有相關文檔

#### 測試與品質保證
- **禁止提交未經測試的代碼** - 必須通過完整測試套件
- **禁止跳過異常處理** - 所有可能的錯誤情況都必須妥善處理
- **禁止移除現有的測試案例** - 除非對應功能已被移除
- **禁止使用不安全的檔案操作** - 必須驗證路徑和權限

#### 使用者體驗
- **禁止移除圖片上傳功能** - 這是核心功能之一
- **禁止破壞響應式設計** - 必須支援不同螢幕尺寸
- **禁止移除鍵盤快捷鍵** - 維持良好的使用者體驗
- **禁止硬編碼環境特定路徑** - 必須使用動態檢測和配置

### **⚠️ 謹慎處理**

#### 依賴管理
- **謹慎升級核心依賴** - fastmcp, FastAPI 等核心依賴升級需全面測試
- **謹慎新增新依賴** - 評估必要性，避免依賴膨脹
- **謹慎修改 pyproject.toml** - 確保不破壞建構和安裝流程

#### 效能相關
- **謹慎修改 WebSocket 訊息處理邏輯** - 可能影響即時性
- **謹慎修改圖片處理演算法** - 可能影響效能和記憶體使用
- **謹慎修改環境檢測邏輯** - 可能影響多平台支援

### 開發範例指引

#### ✅ 正確做法範例
```python
# 正確的工具函數實作
@server.tool()
async def interactive_feedback(
    summary: Annotated[str, "AI work summary"],
    timeout: Annotated[int, "Timeout in seconds"] = 600
) -> list[types.TextContent | types.ImageContent]:
    """正確的參數驗證和錯誤處理"""
    try:
        # 實作邏輯
        return await handle_feedback(summary, timeout)
    except Exception as e:
        logger.error(f"Feedback error: {e}")
        return [types.TextContent(text=f"Error: {str(e)}")]
```

#### ❌ 錯誤做法範例  
```python
# 錯誤：缺少錯誤處理和型別註解
@server.tool()
def bad_feedback(summary, timeout=600):
    # 直接處理，沒有異常捕獲
    return handle_feedback(summary, timeout)
```

#### ✅ 正確的多語言檔案同步
```bash
# 修改 README.md 後的正確流程
1. 修改 README.md (英文版)
2. 同步修改 README.zh-CN.md (簡體中文版)  
3. 同步修改 README.zh-TW.md (繁體中文版)
4. 檢查三個檔案的結構和內容一致性
```

#### ❌ 錯誤的多語言處理
```bash
# 錯誤：只修改單一語言檔案
1. 修改 README.md ❌
2. 沒有同步其他語言版本 ❌
3. 造成文檔不一致 ❌
``` 