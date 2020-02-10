import { Device, DeviceType, MotionSensorState } from "scout-api";
import { SensorServiceFactory } from "./sensorServiceFactory";
import { SensorAccessoryContext } from "../../accessoryFactory/sensorAccessoryFactory";
import { ServiceConstructor, CharacteristicConstructor, CharacteristicValue } from "../../types";
import { HomebridgeContext, ScoutContext } from "../../context";
import { AccessoryContext } from "../../accessoryFactory";

export class MotionSensorServiceFactory extends SensorServiceFactory {
    public constructor(homebridge: HomebridgeContext, scout: ScoutContext) {
        super(homebridge, scout);
    }

    public getService(context: AccessoryContext<SensorAccessoryContext>): ServiceConstructor | undefined {
        if (undefined !== this.getSensorState(context)) {
            return this.homebridge.api.hap.Service.MotionSensor;
        }
    }

    protected getCharacteristics(context: AccessoryContext<SensorAccessoryContext>): Map<CharacteristicConstructor<unknown>, CharacteristicValue> {
        const characteristics = super.getCharacteristics(context);
        const state = this.getSensorState(context);

        if (state !== undefined) {
            characteristics.set(this.homebridge.api.hap.Characteristic.MotionDetected, state);
        }

        return characteristics;
    }

    private getSensorState(context: AccessoryContext<SensorAccessoryContext>): boolean | undefined {
        switch (this.getDeviceState(context.custom.device)) {
            case MotionSensorState.Start:
                return true;
            case MotionSensorState.Stop:
                return false;
        }
    }

    private getDeviceState(device: Device): MotionSensorState | undefined {
        if (device.type === DeviceType.MotionSensor) {
            return device?.reported?.trigger?.state as MotionSensorState;
        }
    }
}
