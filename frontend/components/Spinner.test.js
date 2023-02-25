// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.

import React from "react";
import Spinner from "./Spinner";
import { screen, render } from "@testing-library/react";

test("sanity", () => {
  expect(true).not.toBe(false);
});

test("Renders Spinner Without Errors", () => {
  render(<Spinner />);
});

test("Does not render with a boolean value of false", () => {
  render(<Spinner on={false} />);
  const message = screen.queryByText(/Please wait.../i);
  expect(message).toBeNull();
});

test("Does render with a boolean value of true", () => {
  render(<Spinner on={true} />);
  const message = screen.queryByText(/Please wait.../i);
  expect(message).not.toBeNull();
});
