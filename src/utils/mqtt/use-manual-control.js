import { userMqtt } from './useMqtt';
import Vue from 'vue';
const vm = new Vue({
    data: {
        isCurrentFlightController: null,
    },
})
export const KeyCode = {
    KEY_W: 'KeyW',
    KEY_A: 'KeyA',
    KEY_S: 'KeyS',
    KEY_D: 'KeyD',
    KEY_Q: 'KeyQ',
    KEY_E: 'KeyE',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
}

const DroneControlProtocol = {
    x: 'number', // 水平方向速度，正值为A指令  负值为D指令 单位：m/s
    y: 'number', // 前进后退方向速度，正值为W指令  负值为S指令 单位：m/s
    h: 'number',// 上下高度值，正值为上升指令  负值为下降指令 单位：m
    w: 'number', // 机头角速度，正值为顺时针，负值为逆时针 单位：degree/s   （web端暂无此设计）
    seq: 'number', // 从0计时
} //handlePublish函数的参数（params）传的就是这个对象（DRC-飞行控制）
export const DRC_METHOD = {
    HEART_BEAT: 'heart_beat',
    DRONE_CONTROL: 'drone_control', // 飞行控制-虚拟摇杆
    DRONE_EMERGENCY_STOP: 'drone_emergency_stop', // 急停
    OSD_INFO_PUSH: 'osd_info_push', // 高频osd信息上报
    HSI_INFO_PUSH: 'hsi_info_push', // 避障信息上报
    DELAY_TIME_INFO_PUSH: 'delay_info_push', // 图传链路延时信息上报
}
let myInterval;
export function useManualControl(deviceTopicInfo, isCurrentFlightController) {
    let activeCodeKey = null;
    vm.isCurrentFlightController = isCurrentFlightController;

    const mqttHooks = userMqtt(deviceTopicInfo);

    let seq = 0;
    function handlePublish(params) {
        const body = {
            method: DRC_METHOD.DRONE_CONTROL,
            data: params,
        }
        handleClearInterval()
        myInterval = setInterval(() => {
            body.data.seq = seq++
            seq++
            mqttHooks?.publishMqtt(deviceTopicInfo.pubTopic, body, { qos: 0 })
            console.log(seq, deviceTopicInfo);
        }, 50)
    };
    function handleKeyup(keyCode) {
        if (!deviceTopicInfo.pubTopic) {
            vm.$message.error('请确保已经建立DRC链路')
            return
        }
        const SPEED = 5 //  check
        const HEIGHT = 5 //  check
        const W_SPEED = 20 // 机头角速度
        seq = 0
        switch (keyCode) {
            case 'KeyA':
                if (activeCodeKey === keyCode) return
                handlePublish({ y: -SPEED })
                activeCodeKey = keyCode
                break
            case 'KeyW':
                if (activeCodeKey === keyCode) return
                handlePublish({ x: SPEED })
                activeCodeKey = keyCode
                break
            case 'KeyS':
                if (activeCodeKey === keyCode) return
                handlePublish({ x: -SPEED })
                activeCodeKey = keyCode
                break
            case 'KeyD':
                if (activeCodeKey === keyCode) return
                handlePublish({ y: SPEED })
                activeCodeKey = keyCode
                break
            case 'ArrowUp':
                if (activeCodeKey === keyCode) return
                handlePublish({ h: HEIGHT })
                activeCodeKey = keyCode
                break
            case 'ArrowDown':
                if (activeCodeKey === keyCode) return
                handlePublish({ h: -HEIGHT })
                activeCodeKey = keyCode
                break
            case 'KeyQ':
                if (activeCodeKey === keyCode) return
                handlePublish({ w: -W_SPEED })
                activeCodeKey = keyCode
                break
            case 'KeyE':
                if (activeCodeKey === keyCode) return
                handlePublish({ w: W_SPEED })
                activeCodeKey = keyCode
                break
            default:
                break
        }
    };
    function handleClearInterval() {
        clearInterval(myInterval)
        myInterval = undefined
    };
    function resetControlState() {
        activeCodeKey = null
        seq = 0
        clearInterval(myInterval)
        myInterval = undefined
    };
    function onKeyup() {
        resetControlState()
    };
    function onKeydown(e) {
        handleKeyup(e.code)
    };
    function startKeyboardManualControl() {
        window.addEventListener('keydown', onKeydown)
        window.addEventListener('keyup', onKeyup)
    };

    function closeKeyboardManualControl() {
        resetControlState()
        window.removeEventListener('keydown', onKeydown)
        window.removeEventListener('keyup', onKeyup)
    };
    vm.$watch('isCurrentFlightController', (val) => {
        if (val && deviceTopicInfo.pubTopic) {
            startKeyboardManualControl()
        } else {
            closeKeyboardManualControl()
        }
    }, { immediate: true })
    function handleEmergencyStop() {
        if (!deviceTopicInfo.pubTopic) {
            vm.$message.error('请确保已经建立DRC链路')
            return
        }
        const body = {
            method: DRC_METHOD.DRONE_EMERGENCY_STOP,
            data: {}
        }
        resetControlState()
        window.console.log('handleEmergencyStop>>>>', deviceTopicInfo.pubTopic, body)
        mqttHooks?.publishMqtt(deviceTopicInfo.pubTopic, body, { qos: 1 })

    };
    function unsubscribe() {
        console.log('销毁已订阅事件');
        closeKeyboardManualControl();
        mqttHooks?.unsubscribeDrc()
    }
    return {
        activeCodeKey,
        handleKeyup,
        handleEmergencyStop,
        resetControlState,
        unsubscribe
    }
}