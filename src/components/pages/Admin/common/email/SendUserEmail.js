import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Container from "../../../../atoms/Container";
import Text from "../../../../atoms/Text";
import SubText from "../../../../atoms/SubText";
import Input from "../../../../atoms/Input";
import Textarea from "../../../../atoms/Textarea";
import Button from "../../../../atoms/Button";

import ProcessModal from "../../../../organisms/ProcessModal";
import ConfirmationModal from "../../../../organisms/ConfirmationModal";

import { userEmailSchema } from "../../../../../validators/email";

import { useAdminUser } from "../../../../../hooks/useUsers";
import { useProcess } from "../../../../../hooks/useProcess";
import { useToggle } from "../../../../../hooks/useToggle";

import axiosInstance from "../../../../../utils/axios";

import { AdminOnly } from "../AdminChecker";
import Select from "../../../../atoms/Select";

const SendUserEmail = () => {
  const { userId } = useParams();

  const { user } = useAdminUser(userId);

  const [paragraphs, setParagraphs] = useState(1);
  const newParagraph = () => {
    setParagraphs(paragraphs + 1);
  };

  const {
    show: showEmailModal,
    open: openEmailModal,
    close: closeEmailModal,
  } = useToggle();

  const {
    show,
    processing,
    response,
    success,
    start,
    complete,
    fail,
    close: closeProcess,
  } = useProcess();

  const defaultValues = {
    from: "support",
    customFrom: "",
    title: "",
    body: "",
    body2: null,
    body3: null,
  };

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState,
    reset,
    setError,
    errors,
  } = useForm({
    defaultValues,
    resolver: yupResolver(userEmailSchema),
  });

  const { isSubmitting } = formState;
  const { from } = watch();

  const close = () => {
    closeProcess();
    reset();
    setParagraphs(1);
  };

  const DOMAIN = process.env.REACT_APP_DOMAIN;

  const sendMail = async () => {
    const { customFrom, ...formData } = getValues();

    let data = formData;
    if (customFrom) data = { ...formData, from: customFrom };

    try {
      start();
      await axiosInstance.post("/core/send-mail", {
        ...data,
        email: user.email,
      });
      complete("Email sent successfully");
    } catch (err) {
      console.log(err.response);
      fail("Email not sent");
      setError(
        "server",
        {
          type: "server",
          message: err.response.data.message,
        },
        {
          shouldRevalidate: true,
        }
      );
    }
  };

  const advancedMailer =
    process.env.REACT_APP_ADVANCED_MAILER?.toLowerCase() === "true";

  return (
    <AdminOnly>
      <Container p="12px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          Send Email
        </Text>
        <Text p="12px 0" font="12px" opacity="0.6" bold multiline>
          Send an email to {user.fullName}. Email would also be copied to app's
          email address
        </Text>
      </Container>

      <Container
        as="form"
        p="12px"
        wide
        onSubmit={handleSubmit(openEmailModal)}
      >
        {advancedMailer && (
          <>
            <Select
              radius="8px"
              p="14px 12px"
              label="Sender"
              ref={register}
              name="from"
              error={errors.from?.message}
            >
              <option value="support">support@{DOMAIN}</option>
              <option value="info">info@{DOMAIN}</option>
              <option value="custom">Custom sender</option>
            </Select>
            {from === "custom" && (
              <Input
                label={`Sender Address (without @${DOMAIN})`}
                placeholder="Sender Address"
                radius="8px"
                ref={register}
                name="customFrom"
                error={errors.customFrom?.message}
              />
            )}
          </>
        )}
        <Input
          label="Title"
          placeholder="Title"
          radius="8px"
          ref={register}
          name="title"
          error={errors.title?.message}
        />

        <Textarea
          label="Body"
          placeholder="Message Body"
          rows="10"
          radius="8px"
          ref={register}
          name="body"
          error={errors.body?.message}
        />

        {paragraphs >= 2 && (
          <Textarea
            placeholder="Second Paragraph"
            rows="6"
            radius="8px"
            ref={register}
            name="body2"
            error={errors.body2?.message}
          />
        )}

        {paragraphs >= 3 && (
          <Textarea
            placeholder="Third Paragraph"
            rows="6"
            radius="8px"
            ref={register}
            name="body3"
            error={errors.body3?.message}
          />
        )}

        {paragraphs < 3 && (
          <Text font="12px" flexalign justify="center" onClick={newParagraph}>
            Add New Paragraph{" "}
            <SubText font="inherit" p="0" m="0 0 0 12px" flexalign>
              <FaPlus />
            </SubText>
          </Text>
        )}

        {errors.server?.message && (
          <Text font="12px" color="danger" align="center" bold>
            {errors.server?.message}
          </Text>
        )}

        <Button
          type="submit"
          bg="primary"
          m="24px 0"
          radius="4px"
          bold
          full
          disabled={isSubmitting}
        >
          Send Email
        </Button>
      </Container>

      <ConfirmationModal
        open={showEmailModal}
        dismiss={closeEmailModal}
        action={sendMail}
        title="Send Email"
        message="Are you sure you want to send this email?"
      />

      <ProcessModal
        title="Sending Email"
        open={show}
        processing={processing}
        response={response}
        success={success}
        dismiss={close}
      />
    </AdminOnly>
  );
};

export default SendUserEmail;
