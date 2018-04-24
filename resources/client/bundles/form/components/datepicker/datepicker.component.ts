import flatpickr, { Instance } from 'flatpickr';
import { Component, Prop } from 'vue-property-decorator';

import { FormElementComponent } from '@app/bundles/form/components/element/form.element.component';
import { dateOptions, dateTimeOptions } from './datepicker.options.value';
import datepickerTemplate from './datepicker.template';

@Component({ template: datepickerTemplate() })
export class DatepickerComponent extends FormElementComponent {

    @Prop()
    public placeholder: string;

    @Prop({ default: false })
    public time: boolean;

    @Prop({ default: false })
    public optional: boolean;

    protected clear: () => void = () => undefined;

    protected get hasSlot(): boolean {
        return !!this.$slots.default;
    }

    protected mounted(): void {
        if (!(this.$refs.input instanceof HTMLElement)) return;
        flatpickr(this.$refs.input, this.flatpickrOptions());
    }

    protected flatpickrOptions(): flatpickr.Options.Options {
        return {
            ...(this.time ? dateTimeOptions : dateOptions),
            altInput: false,
            onChange: selectedDates => {
                if (selectedDates.length < 1) return;
                this.elementValue = this.dateToString(selectedDates[0]);
            },
            onReady: (selectedDates, dateStr, instance) => {
                this.makeMethods(instance);
                if (!this.elementValue || typeof this.elementValue !== 'string') return;
                instance.setDate(this.stringToDate(this.elementValue));
                if (instance.selectedDates.length < 1) return;
                this.elementValue = this.dateToString(instance.selectedDates[0]);
            },
        };
    }

    protected makeMethods(instance: Instance): void {
        this.clear = () => {
            this.elementValue = '';
            instance.close();
            instance.clear();
        };
    }

    // This method should not be here
    private stringToDate(str: string): Date {
        const [date, time] = str.split(' ');
        const [year, month, day] = date.split('-');
        const [hour = 0, minute = 0] = (time || '').split(':');
        return new Date(+year, +month - 1, +day, +hour, +minute);
    }

    // This method should not be here
    private dateToString(date: Date): string {
        const pad = (value: any) => value.toString().padStart(2, '0');
        const result = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        return this.time
            ? `${result} ${pad(date.getHours())}:${pad(date.getMinutes())}`
            : result;
    }

}
