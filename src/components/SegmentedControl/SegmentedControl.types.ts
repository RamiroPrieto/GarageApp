export type SegmentedControlProps = {
    value: "login" | "register";
    onChange: (value: "login" | "register") => void;
  };