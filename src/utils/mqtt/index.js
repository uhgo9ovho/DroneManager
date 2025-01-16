import EventEmitter from 'eventemitter3'
import {
    OPTIONS,
} from './config'
import {
    connect,
    MqttClient,
    IClientPublishOptions,
    IPublishPacket,
    Packet,
    ISubscriptionGrant,
    IClientOptions,
} from 'mqtt/dist/mqtt.min'
import {
    connectDRCAPI,
    enterDRCAPI,
    exitDRCAPI
} from "@/api/user.js";
import store from '@/store'
export class UranusMqtt extends EventEmitter {

    constructor(url, options) {
        super()
        this._url = url || ''
        this._options = options
        this._client = null
        this._hasInit = false
    }

    initMqtt = () => {
        // 仅初始化一次
        if (this._hasInit) return
        // 建立连接
        this._client = connect(this._url, {
            ...OPTIONS,
            ...this._options,
        })
        this._hasInit = true
        if (this._client) {
            this._client.on('connect', () => {
                console.log('connect success');

            })

            this._client.on('reconnect', this._onReconnect)

            // 消息监听
            this._client.on('message', this._onMessage)

            // 连接关闭
            this._client.on('close', this._onClose)

            // 连接异常
            this._client.on('error', this._onError)
        }
    }

    // 发布
    publishMqtt = (topic, body, opts) => {

        if (!this._client?.connected) {
            this.initMqtt()
        }
        this._client?.publish(topic, body, opts || {}, (error, packet) => {
            if (error) {
                window.console.error('mqtt publish error,', error, packet)
            }
        })
    }

    // 订阅
    subscribeMqtt = (topic) => {
        console.log(topic, '订阅');

        if (!this._client?.connected) {
            this.initMqtt()
        }
        window.console.log('subscribeMqtt>>>>>', topic)
        this._client?.subscribe(topic, (error, granted) => {
            window.console.log('mqtt subscribe,', error, granted)
        })
    }

    // 取消订阅
    unsubscribeMqtt = (topic) => {
        window.console.log('mqtt unsubscribeMqtt,', topic)
        this._client?.unsubscribe(topic)
    }

    // 关闭 mqtt 客户端
    destroyed = () => {
        window.console.log('mqtt destroyed')
        this._client?.end()
    }

    _onReconnect = () => {
        if (this._client) {
            window.console.error('mqtt reconnect,')
            exitDRCAPI(params).then(res => {
                if (res.code === 0) {
                    connectDRCAPI({}).then(res => {
                        if (res.code === 0) {
                            const { address, client_id, username, password, expire_time } =
                                res.data;
                            console.log(store);

                            const params = {
                                clientId: client_id,
                                dockSn: store.state.droneStatus.deviceSN,
                            };
                            enterDRCAPI(params)
                        }
                    })
                }
            })

        }
    }

    _onMessage = (topic, payload, packet) => {

        this.emit('onMessageMqtt', { topic, payload, packet })
    }

    _onClose = () => {
        // 连接异常关闭会自动重连
        window.console.error('mqtt close,')
    }

    _onError = (error) => {
        // 连接错误会自动重连
        window.console.error('mqtt error,', error)
        this.emit('onStatus', {
            status: 'error',
            data: error,
        })
    }
}

export {
    IClientOptions,
    IPublishPacket,
    IClientPublishOptions,
}
