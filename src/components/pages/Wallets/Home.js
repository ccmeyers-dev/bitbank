import React from "react";
import {
  FaArrowCircleDown,
  FaPlusCircle,
  FaUserPlus,
  FaWallet,
} from "react-icons/fa";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";
import SubText from "../../atoms/SubText";

import InvestmentCard from "../../molecules/InvestmentCard";
import { WalletItemFullCard } from "../../molecules/WalletItem";
import { WalletItemFullCardLoader } from "../../molecules/Loader";

import Upgrade from "../../organisms/Upgrade";
import Pending from "../../organisms/Pending";

import DashboardLayout from "../../templates/Dashboard";

import { useTransactions } from "../../../hooks/useTransactions";
import { useWallets } from "../../../hooks/useWallets";
import { useBalance } from "../../../hooks/useBalance";

const Home = () => {
  const { investments } = useTransactions();
  const { wallets, loading: loadingWallets } = useWallets();
  const { total, bonus, profit, deposit } = useBalance();

  const activeInvestments = investments?.filter((investment) => {
    const date = new Date(investment.date);
    const endDate = new Date(
      date.setDate(date.getDate() + investment.duration)
    );
    const active = new Date() < endDate;

    return active;
  });

  return (
    <DashboardLayout>
      <Upgrade />

      <Text font="16px" p="12px" bold>
        My Balances
      </Text>
      <Container display="grid" gap="12px" p="12px" wide>
        <Container p="12px 16px" bg="bg" flex="flex-between" radius="8px" wide>
          <Container wide>
            <Text p="0" m="0 0 16px 0" font="10px" opacity="0.6" bold flexalign>
              <SubText font="14px" p="0" m="0 6px 0 0" flexalign>
                <FaWallet />
              </SubText>
              Total Balance
            </Text>
            <Text p="0" font="20px" bold>
              $ {total}
            </Text>
          </Container>
          <Text font="16px" p="0" m="0 6px 0 0" flexalign>
            <FaWallet />
          </Text>
        </Container>

        <Container p="12px 16px" bg="bg" flex="flex-between" radius="8px" wide>
          <Container wide>
            <Text p="0" m="0 0 16px 0" font="10px" opacity="0.6" bold>
              Bonus
            </Text>
            <Text p="0" font="20px" bold>
              $ {bonus}
            </Text>
          </Container>
          <Text font="16px" p="0" m="0 6px 0 0" flexalign>
            <FaUserPlus />
          </Text>
        </Container>

        <Container p="12px 16px" bg="bg" flex="flex-between" radius="8px" wide>
          <Container wide>
            <Text p="0" m="0 0 16px 0" font="10px" opacity="0.6" bold>
              Deposits
            </Text>
            <Text p="0" font="20px" bold>
              $ {deposit}
            </Text>
          </Container>
          <Text font="16px" p="0" m="0 6px 0 0" flexalign>
            <FaArrowCircleDown />
          </Text>
        </Container>

        <Container p="12px 16px" bg="bg" flex="flex-between" radius="8px" wide>
          <Container wide>
            <Text p="0" m="0 0 16px 0" font="10px" opacity="0.6" bold>
              Profit
            </Text>
            <Text p="0" font="20px" bold>
              $ {profit}
            </Text>
          </Container>
          <Text font="16px" p="0" m="0 6px 0 0" flexalign>
            <FaPlusCircle />
          </Text>
        </Container>
      </Container>

      <Pending />

      {activeInvestments?.length > 0 && (
        <>
          <Text font="16px" p="12px" bold>
            Active Investments
          </Text>
          <Container
            p="12px"
            display="grid"
            flow="column"
            gap="12px"
            scrollX
            wide
          >
            {investments.map((investment) => (
              <InvestmentCard key={investment._id} investment={investment} />
            ))}
          </Container>
        </>
      )}

      <Text font="16px" p="12px" bold>
        My Wallets
      </Text>
      <Container p="12px" wide>
        {loadingWallets ? (
          <WalletItemFullCardLoader />
        ) : wallets.length ? (
          wallets.map((wallet) => (
            <WalletItemFullCard key={wallet._id} wallet={wallet} />
          ))
        ) : (
          <Container minH="240px" flex="center">
            <Text opacity="0.6" bold>
              No Wallets
            </Text>
          </Container>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default Home;
