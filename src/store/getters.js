const getters = {
  sidebar: state => state.app.sidebar,
  sidebarRouters:state => state.permission.sidebarRouters,
  user: state => state.user.user
}
export default getters
