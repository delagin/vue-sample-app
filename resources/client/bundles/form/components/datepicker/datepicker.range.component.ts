import { Component, Inject, Prop } from 'vue-property-decorator';
import componentTemplate from './datepicker.range.template';
import Vue from 'vue';
import slugify from '@app/bundles/utility/string/slugify';
import { ValueType } from '@app/bundles/form/type/value.type';
import { FormStateDao } from '@app/bundles/form/state/form.state.dao';
import { HiddenInputComponent } from '@app/bundles/form/components/hidden/hidden.input.component';
import flatpickr from 'flatpickr';
import { dateRangeOptions, } from '@app/bundles/form/components/datepicker/datepicker.options.value';
import { applicationDateFormats, dateFormat, stringAsDate } from '@app/bundles/utility/date/date.format';

@Component({
    template: componentTemplate(),
    components: {
        'hidden-input': HiddenInputComponent,
    },
})
export class DatepickerRangeComponent extends Vue {
    @Prop({ required: true, type: String })
    public startPath: string;

    @Prop({ required: true, type: String })
    public endPath: string;

    @Prop({ required: false, type: [String, Number, Boolean] })
    public startValue: ValueType;

    @Prop({ required: false, type: [String, Number, Boolean] })
    public endValue: ValueType;

    @Prop()
    public placeholder: string;

    @Inject()
    protected dao: FormStateDao;

    get name(): string {
        return slugify(`${this.startPath}-${this.endPath}`);
    }

    get elementId(): string {
        return slugify(`${this.dao.form.name}-${this.name}`);
    }

    get elementMessage(): string {
        return [
            this.dao.message(this.startPath),
            this.dao.message(this.endPath),
        ].join(', ');
    }

    get hasMessage(): boolean {
        return (this.dao.hasElement(this.startPath) && this.dao.hasMessage(this.startPath))
            || (this.dao.hasElement(this.endPath) && this.dao.hasMessage(this.endPath));
    }

    get isPending(): boolean {
        return this.dao.form.isRegistered() && this.dao.form.isPending();
    }

    protected get hasSlot(): boolean {
        return !!this.$slots.default;
    }

    protected mounted(): void {
        if (!(this.$refs.dateInput instanceof HTMLElement)) return;
        flatpickr(this.$refs.dateInput, this.flatpickrOptions());
    }

    protected flatpickrOptions(): flatpickr.Options.Options {
        return {
            ...dateRangeOptions,
            altInput: false,
            onChange: selectedDates => {
                if (selectedDates.length < 1) return;
                if (selectedDates[0]) {
                    (<HiddenInputComponent>this.$refs.startInput).elementValue = this.dateToString(selectedDates[0]);
                }

                if (selectedDates[1]) {
                    (<HiddenInputComponent>this.$refs.endInput).elementValue = this.dateToString(selectedDates[1]);
                }
            },
            onReady: (selectedDates, dateStr, instance) => {
                const dates = [];
                const start = (<HiddenInputComponent>this.$refs.startInput).elementValue;
                const end = (<HiddenInputComponent>this.$refs.endInput).elementValue;

                if (start && typeof start === 'string') {
                    dates.push(this.stringToDate(start));
                }

                if (end && typeof end === 'string') {
                    dates.push(this.stringToDate(end));
                }

                instance.setDate(dates);
            },
        };
    }

    private stringToDate(str: string): Date {
        return stringAsDate(str, applicationDateFormats.apiDate);
    }

    private dateToString(date: Date): string {
        return dateFormat(date, applicationDateFormats.apiDate);
    }

    protected rememberPrevious(): void {
        (<HiddenInputComponent>this.$refs.startInput).rememberPrevious();
        (<HiddenInputComponent>this.$refs.endInput).rememberPrevious();
    }

    protected reset(): void {
        (<HiddenInputComponent>this.$refs.startInput).reset();
        (<HiddenInputComponent>this.$refs.endInput).reset();
    }

}
