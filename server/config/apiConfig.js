module.exports = {
    loginUser: {
        mock: false,
        url: 'madrox/app/v1/login',
        mockUrl: '/loginUser.js',
        dataAttribute: 'qs'
    },

    logoutUser: {
        url: 'madrox/app/v1/logout'
    },

    loggedInUserDetails: {
        mock: false,
        url: 'madrox/app/v1/user/details',
        mockUrl: '/userDetailResponse.js'
    }
}