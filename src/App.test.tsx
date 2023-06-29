import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "@/App";

test("render <App />", () => {
  const { getByText } = render(<App />);
  const title = getByText("create-boilerplate-vite-react-ts");

  expect(title).toBeInTheDocument();
});
