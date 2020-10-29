import { Poll } from './poll'


class Globalvar<T> {
    variable: T

    constructor(variable:  T) {
        this.variable = variable;
    }

    assign(value: T) {
        this.variable = value
    }

    value(): T {
        return this.variable;
    }
}

export let PollInProgress: Globalvar<Poll[]> = new Globalvar<Poll[]>([]);