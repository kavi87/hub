import module = require('./module');
import angular = require("{angular}/angular");
import IResource = angular.resource.IResource;

class UserUpdateController {
    public user:any;
    public fileUploadSuccess:any;
    public fileUploadFailure:any;
    public fileUploadProgress:number;

    static $inject = ['HomeService', '$location', 'AuthenticationService', 'Upload', '$timeout'];


    constructor(private api, private $location, private authService, private fileUpload, private $timeout) {

        this.getUser().$promise
            .then((user:any) => {
                return this.user = user
            })
            .catch(reason => {
                UserUpdateController.promiseRejected(reason);
            });
    };

    private getUser():IResource {
        return this.api('home').enter('user', {userId: this.authService.subjectPrincipals().userId}).get();
    }

    public static getUserIcon(user):IResource {
        return user.$links('users/icon').get();
    }

    public uploadIcon(dataUrl, name) {
        this.fileUpload({
            url: '',
            data: {
                file: this.fileUpload.dataUrltoBlob(dataUrl, name)
            }
        }).then(response => {
            this.$timeout(() => {
                this.fileUploadSuccess = response.data;
            });
        }, rejected => {
            this.fileUploadFailure = rejected;
            UserUpdateController.promiseRejected(rejected);
        }, evt => {
            this.fileUploadProgress = parseInt(100.0 * evt.loaded / evt.total);
        })
    }

    public view(component:Component):void {
        this.$location.path('hub/component/' + component.id);
    }

    public static promiseRejected(reason):void {
        throw new Error(reason.statusText || reason.data || reason);
    }
}

angular
    .module(module.angularModules)
    .controller('UserUpdateController', UserUpdateController);