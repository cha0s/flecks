import {React} from '@flecks/react';

const UserLocalLogin = () => (
  <form action="/auth/local" method="post">
    <label>
      <span>Email address</span>
      <input name="email" type="text" />
    </label>
    <label>
      <span>Password</span>
      <input name="password" type="password" />
    </label>
    <div>
      <label>
        <input type="checkbox" />
        <span>Remember me</span>
      </label>
      <a href="/auth/forgot">Forgot password?</a>
    </div>
    <label>
      <input type="submit" value="Sign in" />
    </label>
  </form>
);

export default UserLocalLogin;
