module.exports = {

    // These are environments that existed at one point but not all may be supported
    getCategories() {
        return ['Snacks', 'MainDishes', 'Desserts', 'SideDishes', 'Smoothies', 'Pickles', 'Dhal', 'General']
    },

    // These are the current supported environments.  Add a new env here to add support
    getMenuOptions() {
        return ['NewRecipe', 'View', 'Home','Search']
    },


    getrecipeNames() {
        return ['NewRecipe', 'View', 'Home','Search']
    }

    // getAwsEnvs() {
    //     return ['aws_dev', 'aws_master'];
    // },
    //
    // getEnvAlternateName(env) {
    //     let envNameMap = {
    //         dev: 'kaiju',
    //         aws_dev: 'dev',
    //         aws_master: 'master',
    //         master: 'sharknado',
    //         qe1: 'qe1',
    //         stf: 'stf'
    //     };
    //
    //     return envNameMap[env];
    // }

}