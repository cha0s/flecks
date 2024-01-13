/* eslint-disable jsx-a11y/control-has-associated-label */
import {React} from '@flecks/react';

function PassportLocalLogin() {
  return (
    <form action="/auth/local" method="post">
      <label>
        <span>Email address</span>
        <input autoComplete="username" name="email" type="text" />
      </label>
      <label>
        <span>Password</span>
        <input autoComplete="current-password" name="password" type="password" />
      </label>
      <div>
        <label>
          <input type="checkbox" />
          <span>Remember me</span>
        </label>
        <a href="/auth/local/forgot">Forgot password?</a>
      </div>
      <input type="submit" value="Sign in" />
    </form>
  );
}

export default PassportLocalLogin;
