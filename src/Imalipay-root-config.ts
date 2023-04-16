import PubSub from "pubsub-js";
import { LifeCycles, registerApplication, start } from "single-spa";
import {
  constructApplications, constructLayoutEngine, constructRoutes
} from "single-spa-layout";
import "./index.css";

const publish = (event, data) => PubSub.publish(event, data)
const subscribe = (event, callback) => PubSub.subscribe(event, callback)

const basePaths = {
  // dashboard: "dashboard",
  // access: "access",
  // configuration: "configuration/",
  // formbuilder: "configuration/forms",
  // accounting: "configuration/accounting",
  // "customer-management": "customer-management",
  customers: "dashboard/registered-users",
  payments:"dashboard/payments",
  marketPlace: "dashboard/marketPlace",
  loans:"dashboad/loans",
  dashboard: "dashboard",
  auth:'/'
};

const routes = constructRoutes(document.querySelector("#single-spa-layout"), {
  loaders: {
    moduleSpinner: `<div class="spinner-container">
      <div class="loading-spinner">
      </div>
    </div>`,
  },
  errors: {
    moduleError: `<p class="error">Failed to load app</p>`,
  },
  props: {
    basePaths,
  },
});;


const applications = constructApplications({
  routes,
  loadApp: ({ name }) => System.import(name),
});

const layoutEngine = constructLayoutEngine({
  routes,
  applications,
  active: false,
});

registerApplication({
  name: "@Imalipay/dashboard",
  app: (): Promise<LifeCycles> =>
    (window as any).System.import("@Imalipay/dashboard"),
    activeWhen: Object.values(basePaths).filter((v) => v !== "/"),
    customProps: {
      basePaths,
      token: "prop from root",
    },
});

applications.forEach(registerApplication);
layoutEngine.activate();

start();
