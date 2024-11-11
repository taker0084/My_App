import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";

export const loader = async () => {
  //return redirect("/");
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData.entries());
  const response = await fetch("http://localhost:5000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formObject), // オブジェクトをJSONに変換して送信
  });
  if (response.ok) return redirect(`/user/${formData.get("name")}`);
  else {
    const error = response.text;
    return error;
  }
};
export default function Login() {
  const error = useActionData<typeof action>();
  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h2>Log In</h2>
      <form method="post">
        <label htmlFor="username">UserName</label>
        <input type="text" name="username" id="username" required />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" required />
        <button type="submit">LogIn</button>
      </form>
    </div>
  );
}
