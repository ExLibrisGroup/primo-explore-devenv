app.service('TestService', [function () {
    let vm = this;


    vm.manipulate = manipulate;


    function manipulate(str){
        return str.split("").reverse().join("");
    }
}]);
