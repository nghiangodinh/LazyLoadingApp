import { Component } from "@angular/core";
import { IonicPage, NavController, ToastController } from "ionic-angular";
import { Badge } from "@ionic-native/badge";
import {
  InAppBrowser,
  InAppBrowserOptions
} from "@ionic-native/in-app-browser";
import { AppVersion } from "@ionic-native/app-version";
import { Network } from "@ionic-native/network";

import { Subscription } from "rxjs/Subscription";

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  connected: Subscription;
  disconnected: Subscription;

  constructor(
    public navCtrl: NavController,
    private badge: Badge,
    private inAppBrowser: InAppBrowser,
    private app: AppVersion,
    private toast: ToastController,
    private network: Network
  ) {}

  async requestPermission() {
    try {
      let hasPermission = await this.badge.hasPermission();
      console.log(hasPermission);
      if (!hasPermission) {
        let permission = await this.badge.registerPermission();
        console.log(permission);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async setBadges(badgeNumber: number) {
    try {
      let badges = await this.badge.set(badgeNumber);
      console.log(badges);
    } catch (e) {
      console.error(e);
    }
  }

  async getBadges() {
    try {
      let badgeAmount = await this.badge.get();
      console.log(badgeAmount);
    } catch (e) {
      console.error(e);
    }
  }

  async increaseBadges(badgeNumber: string) {
    try {
      let badge = await this.badge.increase(Number(badgeNumber));
      console.log(badge);
    } catch (e) {
      console.error(e);
    }
  }

  async decreaseBadges(badgeNumber: string) {
    try {
      let badge = await this.badge.decrease(Number(badgeNumber));
      console.log(badge);
    } catch (e) {
      console.error(e);
    }
  }

  async clearBadges() {
    try {
      let badge = await this.badge.clear();
      console.log(badge);
    } catch (e) {
      console.error(e);
    }
  }

  openWebpage(url: string) {
    const options: InAppBrowserOptions = {
      zoom: "no"
    };

    // Opening a URL and returning an InAppBrowserObject
    const browser = this.inAppBrowser.create(url, "_self", options);

    // Inject scripts, css and more with browser.X
  }

  /////////////////////////
  appInfo: string = "app info will be displayed here";

  async getAppName() {
    const appName = await this.app.getAppName();
    console.log(appName);
    this.appInfo = "appName: " + appName;
  }

  async getPackageName() {
    const packageName = await this.app.getPackageName();
    console.log(packageName);

    this.appInfo = "packageName: " + packageName;
  }

  async getVersionNumber() {
    const versionNumber = await this.app.getVersionNumber();
    console.log(versionNumber);

    this.appInfo = "versionNumber: " + versionNumber;
  }

  async getVersionCode() {
    const versionCode = await this.app.getVersionCode();
    console.log(versionCode);

    this.appInfo = "versionCode: " + versionCode;
  }

  ////////////////////////////
  ionViewDidEnter() {
    this.connected = this.network.onConnect().subscribe(
      data => {
        console.log(data);
        this.displayNetworkUpdate(data.type);
      },
      error => console.error(error)
    );

    this.disconnected = this.network.onDisconnect().subscribe(
      data => {
        console.log(data);
        this.displayNetworkUpdate(data.type);
      },
      error => console.error(error)
    );
  }

  ionViewWillLeave() {
    this.connected.unsubscribe();
    this.disconnected.unsubscribe();
  }

  displayNetworkUpdate(connectionState: string) {
    let networkType = this.network.type;
    this.toast
      .create({
        message: `You are now ${connectionState} via ${networkType}`,
        duration: 3000
      })
      .present();
  }
}
