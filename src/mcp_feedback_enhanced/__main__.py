#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MCP Interactive Feedback Enhanced - 主程式入口
==============================================

此檔案允許套件透過 `python -m mcp_feedback_enhanced` 執行。

使用方法:
  python -m mcp_feedback_enhanced        # 啟動 MCP 伺服器
  python -m mcp_feedback_enhanced test   # 執行測試
"""

import sys
import argparse
import os

def main():
    """主程式入口點"""
    parser = argparse.ArgumentParser(
        description="MCP Feedback Enhanced Enhanced - 互動式回饋收集 MCP 伺服器"
    )
    
    subparsers = parser.add_subparsers(dest='command', help='可用命令')
    
    # 伺服器命令（預設）
    server_parser = subparsers.add_parser('server', help='啟動 MCP 伺服器（預設）')
    
    # 測試命令
    test_parser = subparsers.add_parser('test', help='執行測試')
    test_parser.add_argument('--web', action='store_true', help='測試 Web UI (自動持續運行)')
    test_parser.add_argument('--timeout', type=int, default=60, help='測試超時時間 (秒)')
    
    # 版本命令
    version_parser = subparsers.add_parser('version', help='顯示版本資訊')
    
    args = parser.parse_args()
    
    if args.command == 'test':
        run_tests(args)
    elif args.command == 'version':
        show_version()
    elif args.command == 'server':
        run_server()
    elif args.command is None:
        run_server()
    else:
        # 不應該到達這裡
        parser.print_help()
        sys.exit(1)

def run_server():
    """啟動 MCP 伺服器"""
    from .server import main as server_main
    return server_main()

def run_tests(args):
    """執行測試"""
    # 啟用調試模式以顯示測試過程
    os.environ["MCP_DEBUG"] = "true"

    if args.web:
        print("🧪 執行 Web UI 測試...")
        success = test_web_ui_simple()
        if not success:
            sys.exit(1)
    else:
        print("❌ 測試功能已簡化")
        print("💡 對於用戶：使用 'test --web' 測試 Web UI")
        print("💡 對於開發者：使用 'uv run pytest' 執行完整測試")
        sys.exit(1)


def test_web_ui_simple():
    """簡單的 Web UI 測試"""
    try:
        from .web.main import WebUIManager
        import tempfile
        import time
        import webbrowser

        print("🔧 創建 Web UI 管理器...")
        manager = WebUIManager(host="127.0.0.1", port=8765)  # 使用固定端口

        print("🔧 創建測試會話...")
        with tempfile.TemporaryDirectory() as temp_dir:
            session_id = manager.create_session(
                temp_dir,
                "Web UI 測試 - 驗證基本功能"
            )

            if session_id:
                print("✅ 會話創建成功")

                print("🚀 啟動 Web 服務器...")
                manager.start_server()
                time.sleep(5)  # 等待服務器完全啟動

                if manager.server_thread and manager.server_thread.is_alive():
                    print("✅ Web 服務器啟動成功")
                    url = f"http://{manager.host}:{manager.port}"
                    print(f"🌐 服務器運行在: {url}")

                    # 嘗試開啟瀏覽器
                    print("🌐 正在開啟瀏覽器...")
                    try:
                        webbrowser.open(url)
                        print("✅ 瀏覽器已開啟")
                    except Exception as e:
                        print(f"⚠️  無法自動開啟瀏覽器: {e}")
                        print(f"💡 請手動開啟瀏覽器並訪問: {url}")

                    print("📝 Web UI 測試完成，進入持續模式...")
                    print("💡 提示：服務器將持續運行，可在瀏覽器中測試互動功能")
                    print("💡 按 Ctrl+C 停止服務器")

                    try:
                        # 保持服務器運行
                        while True:
                            time.sleep(1)
                    except KeyboardInterrupt:
                        print("\n🛑 停止服務器...")
                        return True
                else:
                    print("❌ Web 服務器啟動失敗")
                    return False
            else:
                print("❌ 會話創建失敗")
                return False

    except Exception as e:
        print(f"❌ Web UI 測試失敗: {e}")
        import traceback
        traceback.print_exc()
        return False


def show_version():
    """顯示版本資訊"""
    from . import __version__, __author__
    print(f"MCP Feedback Enhanced Enhanced v{__version__}")
    print(f"作者: {__author__}")
    print("GitHub: https://github.com/Minidoracat/mcp-feedback-enhanced")

if __name__ == "__main__":
    main() 