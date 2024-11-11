import type { LoaderFunctionArgs /*MetaFunction*/ } from "@remix-run/node";
import {
  NavLink,
  useLoaderData,
  //useLoaderData,
  //useRouteLoaderData,
} from "@remix-run/react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const User = params.user ? params.user : "";
  return User;
};

export default function App() {
  const user = useLoaderData<typeof loader>();
  if (user) {
    return (
      <div>
        <h2>hello, {user}</h2>
        <form method="post" action="/logout">
          <button type="submit">Log out</button>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <h2>hello</h2>
        <NavLink to={"/signup"}>Sign up</NavLink>
        <NavLink to={"/login"}>Log in</NavLink>
      </div>
    );
  }
}
