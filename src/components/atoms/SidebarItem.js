import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

import styled, { css } from "styled-components";

const Wrapper = styled(Link).attrs(({ to, href }) => ({
  as: href ? "a" : !to && "div",
}))`
  padding: 12px 16px;
  margin-bottom: 12px;
  border-radius: 6px;
  font-size: 12px;

  color: ${({ color, theme }) => theme.colors[color] || (color && color)};

  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  svg {
    font-size: ${({ iconSize }) => iconSize || "10px"};
    opacity: ${({ iconOpacity }) => iconOpacity || "0.4"};
  }

  &:hover {
    background-color: ${({ theme, nohover }) => !nohover && theme.colors.bg};
  }

  ${({ active }) =>
    active &&
    css`
      background-color: ${({ theme }) => theme.colors.primary};
      color: white;

      svg {
        opacity: 1;
      }

      &:hover {
        background-color: ${({ theme }) => theme.colors.primary};
        color: white;
      }
    `}
`;

const SettingsItem = ({ name, to, exact, icon, ...props }) => {
  const match = useRouteMatch(to);

  const active = to
    ? match
      ? exact
        ? match.isExact
          ? "true"
          : undefined
        : "true"
      : undefined
    : undefined;

  return (
    <Wrapper active={active} to={to} {...props}>
      {name}
      {icon || <FaChevronRight />}
    </Wrapper>
  );
};

export default SettingsItem;
