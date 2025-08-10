import type { Schema, Struct } from '@strapi/strapi';

export interface CommonSchedule extends Struct.ComponentSchema {
  collectionName: 'components_common_schedules';
  info: {
    displayName: 'Schedule';
    icon: 'clock';
  };
  attributes: {
    day: Schema.Attribute.Enumeration<
      [
        'SUNDAY',
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
      ]
    >;
    endTime: Schema.Attribute.Time;
    startTime: Schema.Attribute.Time;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'common.schedule': CommonSchedule;
    }
  }
}
