/*
 * Copyright (c) 2015-2016, The SeedStack authors <http://seedstack.org>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/// <amd-dependency path="{hub}/modules/controllers/wiki-editor"/>
import module = require('./module');
import angular = require("{angular}/angular");
import IResource = angular.resource.IResource;
import IHttpService = angular.IHttpService;

enum SubView {
    IDENTITY = <any> 'identity'
}

function displayDocName() {
    return function (input) {
        return input.split('/').pop();
    };
}

class ComponentDetailsController {
    public component:any;
    public detailsView:SubView;
    public activeWiki:string;
    public activeDoc: string;

    static $inject = [
        'HomeService',
        '$location',
        '$routeParams',
        '$http',
        '$mdToast',
        '$mdDialog',
        '$mdMedia',
        '$window'
    ];

    constructor(
        private api:any,
        private $location: ng.ILocationService,
        private $routeParams:any,
        private $http:IHttpService,
        private $mdToast,
        private $mdDialog,
        private $mdMedia,
        private $window) {

        this.detailsView = SubView.IDENTITY;

        this.getComponent().$promise.then((component:any) => {
            this.component = component;

            var docs = this.component.$embedded('docs');
            if (docs && docs.length) {
                this.activeDoc = docs[0]._links.self.href;
            }

            var wiki = this.component.$embedded('wiki');
            if (wiki && wiki.length) {
                this.activeWiki = wiki[0]._links.self.href;
            }
        });
    }

    public getComponent():IResource {
        return this.api('home').enter('component', {componentId: this.$routeParams.id}).get();
    }

    public viewUser(user: any): void {
        this.$location.path('hub/user/' + user);
    }

    public rateComponent(component):void {
        if (component.isStarred) {
            this.unStarComponent(component);
        } else {
            this.starComponent(component);
        }
    }

    private starComponent(component):void {
        component.$links('star').save(() => {
            component.isStarred = true;
            component.stars++;
        }, (reject) => {
            throw new Error(reject);
        });
    }

    private unStarComponent(component):void {
        component.$links('star').delete(() => {
            component.isStarred = false;
            if (component.stars > 0) {
                component.stars--;
            }
        }, (reject) => {
            throw new Error(reject);
        })
    }

    private toast(message:string) {
        this.$mdToast.show(
            this.$mdToast.simple()
                .textContent(message)
                .position('top right')
                .hideDelay(3000)
        );
    }

    public syncComponent(component):void {
        this.$mdDialog.show({
            templateUrl: require.toUrl('{hub}/views/templates/syncing.tmpl.html'),
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: this.$mdMedia('sm') || this.$mdMedia('xs')
        });

        component.$links('self', {}, {sync: {method: 'PUT'}})
            .sync()
            .$promise
            .then(() => {
                this.getComponent()
                    .$promise
                    .then((component:any) => {
                        this.component = component;
                        this.$mdDialog.hide();
                        this.toast(component.name + ' has been synced!');
                    })
                    .catch(ComponentDetailsController.promiseRejected);
            })
            .catch(ComponentDetailsController.promiseRejected);
    }

    public archiveComponent(component):void {
        component.$links('state', {}, {archive: {method: 'PUT'}})
            .archive('ARCHIVED')
            .$promise
            .then(() => {
                this.component.state = 'ARCHIVED';
                this.toast(component.name + ' has been archived!');
            })
            .catch(ComponentDetailsController.promiseRejected);
    }

    public restoreComponent(component):void {
        component.$links('state', {}, {restore: {method: 'PUT'}})
            .restore('PUBLISHED')
            .$promise
            .then(() => {
                this.component.state = 'PUBLISHED';
                this.toast(component.name + ' has been restored!');
            })
            .catch(ComponentDetailsController.promiseRejected);
    }

    public decodeURIComponent = this.$window.decodeURIComponent;

    public openWikiCreation(wiki): void {
        this.$mdDialog.show({
            controller: 'WikiEditorController',
            controllerAs: '$ctrl',
            templateUrl: require.toUrl('{hub}/views/templates/wiki-editor.tmpl.html'),
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
                wiki: wiki,
                component: this.component
            }
        }).then();
    }

    public editWiki(wiki: string): void {
        this.openWikiCreation(wiki);
    }

    public setActiveWiki(wiki:string):void {
        this.activeWiki = wiki;
    };

    public setActiveDoc(doc: string): void {
        this.activeDoc = doc;
    };

    public static promiseRejected(reason):void {
        throw new Error(reason.statusText || reason.data || reason);
    }
}

angular
    .module(module.angularModules)
    .filter('displayDocName', displayDocName)
    .controller('ComponentDetailsController', ComponentDetailsController);