import React from "react";
import { FaUniversity } from "react-icons/fa";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import SubText from "../atoms/SubText";
import BankBrand from "../atoms/BankBrand";

import BankPicker from "../organisms/BankPicker";

import { useToggle } from "../../hooks/useToggle";

const BankInput = ({
  label,
  error,
  placeholder,
  hint,
  bank,
  banks,
  onChange,
  name,
  ...props
}) => {
  const { show, toggle } = useToggle();

  const { w, m, weight, display, color, ...styleProps } = props;

  const change = (selectedBank) => {
    return onChange({
      target: {
        name: name,
        type: "bank",
        value: selectedBank.name,
        rawValue: selectedBank,
      },
    });
  };

  const selectedBank = banks.find((b) => b.name === bank);

  return (
    <Container
      wide={!w}
      w={w}
      m={m || "8px 0"}
      weight={weight}
      display={display}
    >
      <Text
        color={error ? "danger" : color || undefined}
        font="12px"
        p="5px 12px"
        bold
      >
        {error || label}
      </Text>
      <Text
        as="div"
        bg="bg"
        p="0 8px 0 12px"
        radius="4px"
        onClick={toggle}
        flexalign
        {...styleProps}
      >
        <SubText p="12px 0" font="inherit">
          {selectedBank?.name || placeholder}
        </SubText>
        <SubText
          as="div"
          font="16px"
          p="0"
          m="0 0 0 auto"
          opacity="0.7"
          flexalign
        >
          {selectedBank ? (
            <BankBrand size="32px" logo={selectedBank.name} transparent />
          ) : (
            <FaUniversity />
          )}
        </SubText>
      </Text>
      <BankPicker
        open={show}
        dismiss={toggle}
        title={hint || label}
        banks={banks}
        action={change}
      />
    </Container>
  );
};

export default BankInput;
