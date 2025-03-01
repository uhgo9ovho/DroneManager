import store from '@/store'
class WebSocketClient {
    constructor(url) {
        this._url = url
        this._callbacks = {};
        this._reconnectTimer = null;
        this.init();
    }

    init() {
        this._ws = new WebSocket(this._url);
        this._ws.onopen = () => {
            this.onopen();
        };
        this._ws.onmessage = (e) => {
            this.onmessage(e);
        };
        this._ws.onclose = (e) => {
            if (e.code != 1000) {  // 状态码：1000 正常关闭，不重新建立连接
                this.onclose(e);
                // 尝试重连
                this.reconnect();
            }
        }
    }

    onopen() {
        console.log('WebSocket open: ', this._url);
    }

    onmessage(e) {
        if (e.data) {
            // 预处理字符串，确保键加上引号
            const validJSON = e.data.replace(/([{,])(\d+)(:)/g, '$1"$2"$3');

            // 转换为对象
            const data = JSON.parse(validJSON);
            if (data.code == 'noticeControl') {
                // data
                debugger
                store.dispatch('droneStatus/getControler', data.data);
            } else {
                store.dispatch('droneStatus/getDroneInfo', data);
            }
            const type = 'message';
            if (type in this._callbacks) {
                this._callbacks[type](data);
            }
        }
    }

    onclose(e) {
        console.log('WebSocket close:', e);
    }

    reconnect() {
        clearTimeout(this._reconnectTimer);
        this._reconnectTimer = setTimeout(() => {
            console.log('WebSocket reconnect:', this._url);
            this.init();
        }, 5000);
    }

    send(data) {
        if (this._ws.readyState === WebSocket.OPEN) {
            console.log('WebSocket send:', JSON.stringify(data));
            this._ws.send(JSON.stringify(data));
        }
    }

    registerCallback(type, callback) {
        this._callbacks[type] = callback;
    }
}

export default WebSocketClient;
