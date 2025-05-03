// import { useState } from "react";
import AuthHeader from "../components/AuthHeader.jsx";
import AuthButton from "../components/AuthButton.jsx";
import AuthInputField from "../components/AuthInputField.jsx";
// color="failure" це кольори для інпутів
// color="success"

export default function Registration() {
  return (
    <>
      <div className="auth-container">
        <div className="fixed font-[Inter] inset-0 bg-gray-100/50 flex items-center justify-center z-50 py-[40px] px-[100px]">
          <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <AuthHeader />

            <form className="auth-form flex max-w-md flex-col gap-4">
              <AuthInputField
                id="email"
                label="Пошта"
                type="email"
                placeholder="Enter email"
                required
              />
              <AuthInputField
                id="password"
                label="Пароль"
                placeholder="Введіть пароль"
                required
                isPassword={true}
              />
              {/*<HelperText>*/}
              {/*  <span className="font-medium">*/}
              {/*    Пошта чи пароль введені не вірно!*/}
              {/*  </span>*/}
              {/*</HelperText>*/}
              <AuthButton />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
