type TInvertCoordinatate = [number, number];

export class ORSInputDirections {
    /**
     * Array of [longitute, latitude]
     */
    coordinates: TInvertCoordinatate[];
    alternative_routes?: any;
    attributes?: string[];
    elevation?: boolean;
    extra_info?: string[];
    geometry_simplify?: boolean;
    id?: string;
    instructions?: boolean;
    instructions_format?: string;
    language?: string;
    maneuvers?: boolean;
    options?: Record<string, string>;
    preference?: string;
    radiuses?: number[];
    roundabout_exits?: boolean;
    skip_segments?: number[];
    suppress_warnings?: boolean;
    units?: string;
    geometry?: boolean;
    maximum_speed?: number;
}

export class ORSInputOptimization {
    jobs: {
        /** Unique id of the job*/
        id: number;
        /**
         * A string describing this job
         */
        description?: string;
        /** Job service duration (defaults to 0) */
        service?: number;
        /** An array of integers describing multidimensional quantities */
        delivery?: number[];
        /** An integer in the [0, 100] range describing priority level (defaults to 0) */
        priority?: number;
        /**	Array of [longitute, latitude] */
        location?: TInvertCoordinatate;
        /** An array of integers defining mandatory skills */
        skills?: number[];
        /** An array of pair of timestamps describing valid slots for job service start */
        time_windows?: [number, number][];
    }[];
    vehicles: {
        /** Unique id of the vehicles*/
        id: number;
        /** Routing profile */
        profile?:
            | 'driving-car'
            | 'driving-hgv'
            | 'cycling-regular'
            | 'cycling-mountain'
            | 'cycling-road'
            | 'cycling-electric';
        /**	Stating location [longitute, latitude] */
        start?: TInvertCoordinatate;
        /**	Ending location [longitute, latitude] */
        end?: TInvertCoordinatate;
        /** An array of integers describing multidimensional quantities */
        capacity?: number[];
        /** An array of integers defining skills */
        skills?: number[];
        /** A pair of timestamps describing working hours [start, end] */
        time_window?: [number, number];
        /** Array listing the breaks of the vehicule */
        breaks?: {
            /** Unique id of the breaks*/
            id: number;
            /** An array of time_window objects describing valid slots for break start */
            time_windows: [number, number][];
            /** A string describing this break */
            description?: string;
            /** Break duration (defaults to 0) */
            service?: number;
        }[];
        /** A double value used to scale all vehicle travel times (defaults to 1.), the respected precision is limited to two digits after the decimal point */
        speed_factor?: number;
    }[];
}

export enum ORSOutputOptimizationCodes {
    OK = 0,
    INTERNAL = 1,
    INPUT = 2,
    ROUTING = 3,
}
export class ORSOutputOptimization {
    code: ORSOutputOptimizationCodes;
    error?: string;
    summary: {
        cost: number;
        unassigned: number;
        delivery?: number[];
        pickup?: number[];
        service: number;
        duration: number;
        waiting_time: number;
        priority: number;
        violations: [];
        computing_times: {
            loading: number;
            solving: number;
        };
    };
    'unassigned': [];
    'routes': {
        vehicle: number;
        cost: number;
        delivery?: number[];
        pickup?: number[];
        description?: string;
        service: number;
        duration: number;
        waiting_time: number;
        priority: number;
        steps: {
            type: 'start' | 'job' | 'end';
            location?: TInvertCoordinatate;
            description?: string;
            id?: number;
            service: number;
            waiting_time: number;
            load?: number[];
            arrival: number;
            duration: number;
            violations: [];
        }[];
        violations: [];
    }[];
}
