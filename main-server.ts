import bodyParser from 'body-parser';
import cors from 'cors';
import { Server } from '@overnightjs/core';
import * as controllers from './controllers';
import * as services from './services';

import * as sqlite from 'sqlite3'
import { User } from './models/user';

const sqlite3 = sqlite.verbose();
const db = new sqlite3.Database('./db/rps.db');

class MainServer extends Server {
  constructor() {
    super(true);
    this.setConfig();
    this.setupControllers();
  }

  private setConfig() {
    //Allows us to receive requests with data in json format
    this.app.use(bodyParser.json({ limit: '50mb' }));
    // this.app.use()
    //Allows us to receive requests with data in x-www-form-urlencoded format
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    // this.app.use(
    //   session({
    //     secret: SESSION_SECRET,
    //     resave: true,
    //     saveUninitialized: true,
    //   })
    // );

    //Enables cors
    this.app.use(cors());
    //start and Connect MongosDb
    this.mongoSetup();
  }

  private findMatchingservice( nm:string)
  {
    for (const name of Object.keys(services)) {
      const service = (services as any)[name];
      if (typeof service === 'function' && name.split("Service")[0]==nm) {
        const srv= new service();
        srv.db=db;
        return srv;
      }
    }
  }
  private setupControllers() {
    const controllerInstances = [];
    for (const name of Object.keys(controllers)) {
      const controller = (controllers as any)[name];
      // console.log(`Controller name: ${name}`);
      if (typeof controller === 'function') {
        const srv =this.findMatchingservice(name.split("Controller")[0])
        console.log(`Controllers ${name} Service ${srv}`);
        const ctrl= new controller(srv);
        //ctrl.service= srv


        controllerInstances.push(ctrl);
      }
    }
    console.log(`Controllers ${controllerInstances}`);
    super.addControllers(controllerInstances);
  }

  private mongoSetup(): void {
   
  }

  public start(port:number) {
    this.app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  }

}

export default MainServer;
