export enum formLifecycleState {
    /* Form has been created */
    created          = 'created',
    /* Form is ready to be submitted */
    waitingForSubmit = 'waitingForSubmit',
    /* Form is being submitted */
    pending          = 'pending',
    /* Form response is failed */
    failed           = 'failed',
    /* Form response is successful */
    success          = 'success',
}
