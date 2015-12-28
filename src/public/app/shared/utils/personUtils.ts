import _ = require('lodash');
let mongoose: any = require('mongoose');
// FIXME: see the scabby scabby paths below..
let friendSchema: any = require('../../../../server/models/friendSchema.js');
let userSchema: any = require('../../../../server/models/userSchema');

export class PersonDoc {

    public doc: any;

    constructor(schemaName: string, data: any) {
      console.debug('PersonDoc constructor');
      let schema = schemaName === 'friendSchema' ? friendSchema : userSchema;
      this.doc = mongoose.Document(data, schema);
    }

    public extract(): any {
      let data: any = {};
      this.doc.displayFields().forEach((field: string) => {
        data[field] = _.get(this.doc, field);
      });
      return data;
    }

    public get(): any {
      return this.doc;
    }

    public update(data: any) {
      console.debug('PersonDoc update');
      this.doc.displayFields().forEach((field: string) => {
        this.doc.set(field, _.get(data, field));
      });
    }

  };
