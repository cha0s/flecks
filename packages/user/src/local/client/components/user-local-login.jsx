import {React} from '@flecks/react';

const UserLocalLogin = () => (
  <form action="/auth/local" method="post">
    <input name="email" />
    <input name="password" />
    <input type="submit" />
  </form>
);

export default UserLocalLogin;
