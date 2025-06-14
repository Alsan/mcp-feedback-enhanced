/**
 * MCP Feedback Enhanced - 會話數據管理模組
 * ========================================
 * 
 * 負責會話數據的存儲、更新和狀態管理
 */

(function() {
    'use strict';

    // 確保命名空間存在
    window.MCPFeedback = window.MCPFeedback || {};
    window.MCPFeedback.Session = window.MCPFeedback.Session || {};

    const TimeUtils = window.MCPFeedback.Utils.Time;
    const StatusUtils = window.MCPFeedback.Utils.Status;

    /**
     * 會話數據管理器
     */
    function SessionDataManager(options) {
        options = options || {};

        // 會話數據
        this.currentSession = null;
        this.sessionHistory = [];
        this.lastStatusUpdate = null;

        // 統計數據
        this.sessionStats = {
            todayCount: 0,
            averageDuration: 0,
            totalSessions: 0
        };

        // localStorage 相關設定
        this.localStorageKey = 'mcp-session-history';
        this.settingsManager = options.settingsManager || null;

        // 回調函數
        this.onSessionChange = options.onSessionChange || null;
        this.onHistoryChange = options.onHistoryChange || null;
        this.onStatsChange = options.onStatsChange || null;

        // 初始化：載入歷史記錄並清理過期資料
        this.loadFromLocalStorage();
        this.cleanupExpiredSessions();
        this.updateStats();

        console.log('📊 SessionDataManager 初始化完成');
    }

    /**
     * 更新當前會話
     */
    SessionDataManager.prototype.updateCurrentSession = function(sessionData) {
        console.log('📊 更新當前會話:', sessionData);

        if (this.currentSession && this.currentSession.session_id === sessionData.session_id) {
            // 合併數據，保留重要資訊
            this.currentSession = this.mergeSessionData(this.currentSession, sessionData);
        } else {
            // 新會話或不同會話 ID - 需要處理舊會話
            if (this.currentSession && this.currentSession.session_id) {
                console.log('📊 檢測到會話 ID 變更，處理舊會話:', this.currentSession.session_id, '->', sessionData.session_id);

                // 將舊會話標記為完成並加入歷史記錄
                const oldSession = Object.assign({}, this.currentSession);
                oldSession.status = 'completed';
                oldSession.completed_at = TimeUtils.getCurrentTimestamp();

                // 計算持續時間
                if (oldSession.created_at && !oldSession.duration) {
                    oldSession.duration = oldSession.completed_at - oldSession.created_at;
                }

                console.log('📊 將舊會話加入歷史記錄:', oldSession);
                this.addSessionToHistory(oldSession);
            }

            // 設置新會話
            this.currentSession = this.normalizeSessionData(sessionData);
        }

        // 觸發回調
        if (this.onSessionChange) {
            this.onSessionChange(this.currentSession);
        }

        return this.currentSession;
    };

    /**
     * 合併會話數據
     */
    SessionDataManager.prototype.mergeSessionData = function(existingData, newData) {
        const merged = Object.assign({}, existingData, newData);

        // 確保重要欄位不會被覆蓋為空值
        if (!merged.created_at && existingData.created_at) {
            merged.created_at = existingData.created_at;
        }

        if (!merged.status && existingData.status) {
            merged.status = existingData.status;
        }

        return merged;
    };

    /**
     * 標準化會話數據
     */
    SessionDataManager.prototype.normalizeSessionData = function(sessionData) {
        const normalized = Object.assign({}, sessionData);

        // 補充缺失的時間戳
        if (!normalized.created_at) {
            if (this.lastStatusUpdate && this.lastStatusUpdate.created_at) {
                normalized.created_at = this.lastStatusUpdate.created_at;
            } else {
                normalized.created_at = TimeUtils.getCurrentTimestamp();
            }
        }

        // 補充缺失的狀態
        if (!normalized.status) {
            normalized.status = 'waiting';
        }

        // 標準化時間戳
        if (normalized.created_at) {
            normalized.created_at = TimeUtils.normalizeTimestamp(normalized.created_at);
        }

        return normalized;
    };

    /**
     * 更新狀態資訊
     */
    SessionDataManager.prototype.updateStatusInfo = function(statusInfo) {
        console.log('📊 更新狀態資訊:', statusInfo);

        this.lastStatusUpdate = statusInfo;

        if (statusInfo.session_id || statusInfo.created_at) {
            const sessionData = {
                session_id: statusInfo.session_id || (this.currentSession && this.currentSession.session_id),
                status: statusInfo.status,
                created_at: statusInfo.created_at,
                project_directory: statusInfo.project_directory || this.getProjectDirectory(),
                summary: statusInfo.summary || this.getAISummary()
            };

            // 檢查會話是否完成
            if (StatusUtils.isCompletedStatus(statusInfo.status)) {
                this.handleSessionCompleted(sessionData);
            } else {
                this.updateCurrentSession(sessionData);
            }
        }
    };

    /**
     * 處理會話完成
     */
    SessionDataManager.prototype.handleSessionCompleted = function(sessionData) {
        console.log('📊 處理會話完成:', sessionData);

        // 確保會話有完成時間
        if (!sessionData.completed_at) {
            sessionData.completed_at = TimeUtils.getCurrentTimestamp();
        }

        // 計算持續時間
        if (sessionData.created_at && !sessionData.duration) {
            sessionData.duration = sessionData.completed_at - sessionData.created_at;
        }

        // 將完成的會話加入歷史記錄
        this.addSessionToHistory(sessionData);

        // 如果是當前會話完成，保持引用但標記為完成
        if (this.currentSession && this.currentSession.session_id === sessionData.session_id) {
            this.currentSession = Object.assign(this.currentSession, sessionData);
            if (this.onSessionChange) {
                this.onSessionChange(this.currentSession);
            }
        }
    };

    /**
     * 新增會話到歷史記錄
     */
    SessionDataManager.prototype.addSessionToHistory = function(sessionData) {
        console.log('📊 新增會話到歷史記錄:', sessionData);

        // 只有已完成的會話才加入歷史記錄
        if (!StatusUtils.isCompletedStatus(sessionData.status)) {
            console.log('📊 跳過未完成的會話:', sessionData.session_id);
            return false;
        }

        // 新增儲存時間戳記
        sessionData.saved_at = TimeUtils.getCurrentTimestamp();

        // 避免重複新增
        const existingIndex = this.sessionHistory.findIndex(s => s.session_id === sessionData.session_id);
        if (existingIndex !== -1) {
            this.sessionHistory[existingIndex] = sessionData;
        } else {
            this.sessionHistory.unshift(sessionData);
        }

        // 限制歷史記錄數量
        if (this.sessionHistory.length > 10) {
            this.sessionHistory = this.sessionHistory.slice(0, 10);
        }

        // 保存到 localStorage
        this.saveToLocalStorage();

        this.updateStats();

        // 觸發回調
        if (this.onHistoryChange) {
            this.onHistoryChange(this.sessionHistory);
        }

        return true;
    };

    /**
     * 獲取當前會話
     */
    SessionDataManager.prototype.getCurrentSession = function() {
        return this.currentSession;
    };

    /**
     * 獲取會話歷史
     */
    SessionDataManager.prototype.getSessionHistory = function() {
        return this.sessionHistory.slice(); // 返回副本
    };

    /**
     * 根據 ID 查找會話
     */
    SessionDataManager.prototype.findSessionById = function(sessionId) {
        // 先檢查當前會話
        if (this.currentSession && this.currentSession.session_id === sessionId) {
            return this.currentSession;
        }

        // 再檢查歷史記錄
        return this.sessionHistory.find(s => s.session_id === sessionId) || null;
    };

    /**
     * 更新統計資訊
     */
    SessionDataManager.prototype.updateStats = function() {
        // 計算今日會話數
        const todayStart = TimeUtils.getTodayStartTimestamp();
        this.sessionStats.todayCount = this.sessionHistory.filter(function(session) {
            return session.created_at && session.created_at >= todayStart;
        }).length;

        // 計算平均持續時間
        const completedSessions = this.sessionHistory.filter(s => s.duration && s.duration > 0);
        if (completedSessions.length > 0) {
            const totalDuration = completedSessions.reduce((sum, s) => sum + s.duration, 0);
            this.sessionStats.averageDuration = Math.round(totalDuration / completedSessions.length);
        } else {
            this.sessionStats.averageDuration = 0;
        }

        this.sessionStats.totalSessions = this.sessionHistory.length;

        // 觸發回調
        if (this.onStatsChange) {
            this.onStatsChange(this.sessionStats);
        }
    };

    /**
     * 獲取統計資訊
     */
    SessionDataManager.prototype.getStats = function() {
        return Object.assign({}, this.sessionStats);
    };

    /**
     * 清空會話數據
     */
    SessionDataManager.prototype.clearCurrentSession = function() {
        this.currentSession = null;
        if (this.onSessionChange) {
            this.onSessionChange(null);
        }
    };

    /**
     * 清空歷史記錄
     */
    SessionDataManager.prototype.clearHistory = function() {
        this.sessionHistory = [];

        // 清空 localStorage
        this.clearLocalStorage();

        this.updateStats();
        if (this.onHistoryChange) {
            this.onHistoryChange(this.sessionHistory);
        }
    };

    /**
     * 獲取專案目錄（輔助方法）
     */
    SessionDataManager.prototype.getProjectDirectory = function() {
        // 嘗試從多個來源獲取專案目錄
        const sources = [
            () => document.querySelector('.session-project')?.textContent?.replace('專案: ', ''),
            () => document.querySelector('.project-info')?.textContent?.replace('專案目錄: ', ''),
            () => this.currentSession?.project_directory
        ];

        for (const source of sources) {
            try {
                const result = source();
                if (result && result !== '未知') {
                    return result;
                }
            } catch (error) {
                // 忽略錯誤，繼續嘗試下一個來源
            }
        }

        return '未知';
    };

    /**
     * 獲取 AI 摘要（輔助方法）
     */
    SessionDataManager.prototype.getAISummary = function() {
        // 嘗試從多個來源獲取 AI 摘要
        const sources = [
            () => {
                const element = document.querySelector('.session-summary');
                const text = element?.textContent;
                return text && text !== 'AI 摘要: 載入中...' ? text.replace('AI 摘要: ', '') : null;
            },
            () => {
                const element = document.querySelector('#combinedSummaryContent');
                return element?.textContent?.trim();
            },
            () => this.currentSession?.summary
        ];

        for (const source of sources) {
            try {
                const result = source();
                if (result && result !== '暫無摘要') {
                    return result;
                }
            } catch (error) {
                // 忽略錯誤，繼續嘗試下一個來源
            }
        }

        return '暫無摘要';
    };

    /**
     * 從 localStorage 載入會話歷史
     */
    SessionDataManager.prototype.loadFromLocalStorage = function() {
        if (!window.localStorage) {
            console.warn('📊 localStorage 不可用');
            return;
        }

        try {
            const stored = localStorage.getItem(this.localStorageKey);
            if (stored) {
                const data = JSON.parse(stored);
                if (data && Array.isArray(data.sessions)) {
                    this.sessionHistory = data.sessions;
                    console.log('📊 從 localStorage 載入', this.sessionHistory.length, '個會話');
                }
            }
        } catch (error) {
            console.error('📊 從 localStorage 載入會話歷史失敗:', error);
        }
    };

    /**
     * 保存會話歷史到 localStorage
     */
    SessionDataManager.prototype.saveToLocalStorage = function() {
        if (!window.localStorage) {
            console.warn('📊 localStorage 不可用');
            return;
        }

        try {
            const data = {
                sessions: this.sessionHistory,
                lastCleanup: TimeUtils.getCurrentTimestamp()
            };
            localStorage.setItem(this.localStorageKey, JSON.stringify(data));
            console.log('📊 已保存', this.sessionHistory.length, '個會話到 localStorage');
        } catch (error) {
            console.error('📊 保存會話歷史到 localStorage 失敗:', error);
        }
    };

    /**
     * 清空 localStorage 中的會話歷史
     */
    SessionDataManager.prototype.clearLocalStorage = function() {
        if (!window.localStorage) {
            return;
        }

        try {
            localStorage.removeItem(this.localStorageKey);
            console.log('📊 已清空 localStorage 中的會話歷史');
        } catch (error) {
            console.error('📊 清空 localStorage 失敗:', error);
        }
    };

    /**
     * 清理過期的會話
     */
    SessionDataManager.prototype.cleanupExpiredSessions = function() {
        if (!this.settingsManager) {
            return;
        }

        const retentionHours = this.settingsManager.get('sessionHistoryRetentionHours', 72);
        const retentionMs = retentionHours * 60 * 60 * 1000;
        const now = TimeUtils.getCurrentTimestamp();

        const originalCount = this.sessionHistory.length;
        this.sessionHistory = this.sessionHistory.filter(function(session) {
            const sessionAge = now - (session.saved_at || session.completed_at || session.created_at || 0);
            return sessionAge < retentionMs;
        });

        const cleanedCount = originalCount - this.sessionHistory.length;
        if (cleanedCount > 0) {
            console.log('📊 清理了', cleanedCount, '個過期會話');
            this.saveToLocalStorage();
        }
    };

    /**
     * 檢查會話是否過期
     */
    SessionDataManager.prototype.isSessionExpired = function(session) {
        if (!this.settingsManager) {
            return false;
        }

        const retentionHours = this.settingsManager.get('sessionHistoryRetentionHours', 72);
        const retentionMs = retentionHours * 60 * 60 * 1000;
        const now = TimeUtils.getCurrentTimestamp();
        const sessionTime = session.saved_at || session.completed_at || session.created_at || 0;

        return (now - sessionTime) > retentionMs;
    };

    /**
     * 匯出會話歷史
     */
    SessionDataManager.prototype.exportSessionHistory = function() {
        const exportData = {
            exportedAt: new Date().toISOString(),
            totalSessions: this.sessionHistory.length,
            sessions: this.sessionHistory.map(function(session) {
                return {
                    session_id: session.session_id,
                    created_at: session.created_at,
                    completed_at: session.completed_at,
                    duration: session.duration,
                    status: session.status,
                    project_directory: session.project_directory,
                    ai_summary: session.summary || session.ai_summary,
                    saved_at: session.saved_at
                };
            })
        };

        const filename = 'session-history-' + new Date().toISOString().split('T')[0] + '.json';
        this.downloadJSON(exportData, filename);

        console.log('📊 匯出了', this.sessionHistory.length, '個會話');
        return filename;
    };

    /**
     * 匯出單一會話
     */
    SessionDataManager.prototype.exportSingleSession = function(sessionId) {
        const session = this.sessionHistory.find(function(s) {
            return s.session_id === sessionId;
        });

        if (!session) {
            console.error('📊 找不到會話:', sessionId);
            return null;
        }

        const exportData = {
            exportedAt: new Date().toISOString(),
            session: {
                session_id: session.session_id,
                created_at: session.created_at,
                completed_at: session.completed_at,
                duration: session.duration,
                status: session.status,
                project_directory: session.project_directory,
                ai_summary: session.summary || session.ai_summary,
                saved_at: session.saved_at
            }
        };

        const shortId = sessionId.substring(0, 8);
        const filename = 'session-' + shortId + '-' + new Date().toISOString().split('T')[0] + '.json';
        this.downloadJSON(exportData, filename);

        console.log('📊 匯出會話:', sessionId);
        return filename;
    };

    /**
     * 下載 JSON 檔案
     */
    SessionDataManager.prototype.downloadJSON = function(data, filename) {
        try {
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('📊 下載檔案失敗:', error);
        }
    };

    /**
     * 清理資源
     */
    SessionDataManager.prototype.cleanup = function() {
        this.currentSession = null;
        this.sessionHistory = [];
        this.lastStatusUpdate = null;
        this.sessionStats = {
            todayCount: 0,
            averageDuration: 0,
            totalSessions: 0
        };

        console.log('📊 SessionDataManager 清理完成');
    };

    // 將 SessionDataManager 加入命名空間
    window.MCPFeedback.Session.DataManager = SessionDataManager;

    console.log('✅ SessionDataManager 模組載入完成');

})();
