import Navbar from "./navbar"

const Layout = ({ children, user = null, role = null }) => (
  <>
  <Navbar user={user} role={role} />
    {children}
  </>
)

export default Layout
