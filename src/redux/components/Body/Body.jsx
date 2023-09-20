import React from "react";
import styles from "./styles";
import moon from "../images/moon2.png";
import star from "../images/star2.png";
import User from "../User/User";
import LoginModal from "../Modal/LoginModal";
import SignUpModal from "../Modal/SignUpModal";
import WriteModal from "../Modal/WriteModal";
import ViewModal from "../Modal/ViewModal";
import { useState } from "react";

function Body() {
  /***********************
    공통
  ***********************/
  // 스타일
  const {
    Main,
    MainWarp,
    Title,
    SubTitle,
    StyledBtn,
    Moon,
    Star,
    SideOverlay,
  } = styles;

  // 별 위치 position
  const starts = [
    { top: "19%", right: "20%", width: "100px" },
    { top: "30%", right: "10%", width: "60px" },
    { top: "43%", right: "12%", width: "80px" },
    { top: "55%", right: "25%", width: "80px" },
    { top: "65%", right: "10%", width: "120px" },

    { top: "auto", left: "10%", width: "100px" },
    { top: "22%", left: "32%", width: "60px" },
    { top: "55%", left: "15%", width: "60px" },
    { top: "38%", left: "25%", width: "80px" },
    { top: "65%", left: "27%", width: "120px" },
  ];

  // 오버레이
  const [showOverlay, setshowOverlay] = useState(false);

  // 모달창 닫기
  const close = () => {
    setshowOverlay(false);
    setopenLoginModal(false);
    setopenSignModal(false);
    setOpenDuckdomModal(false);
  };

  /***********************
    로그인 전
  ***********************/
  // 로그인
  const [openLoginModal, setopenLoginModal] = useState(false);

  const loginOpen = () => {
    setshowOverlay(true);
    setopenLoginModal(true);
  };

  // 회원가입
  const [openSignModal, setopenSignModal] = useState(false);

  const signOpen = () => {
    setshowOverlay(true);
    setopenSignModal(true);
  };

  /***********************
    로그인 후
  ***********************/
  // 덕담 나눠주기 (작성)
  const [openDuckdomModal, setOpenDuckdomModal] = useState(false);
  const giveDuckdom = () => {
    setshowOverlay(true);
    setOpenDuckdomModal(true);
  };

  // 별 추가 (보기)
  const addStar = () => {
    alert("별을 누르면 받은 글을 볼 수 있어요.");
  };

  return (
    <>
      {/* 로그인 안된 상태 */}
      <Main>
        <MainWarp>
          <Title>토끼의 발자국</Title>
          <SubTitle>고마운 마음을 담아 서로에게 덕담 한마디 어떨까요?</SubTitle>
          {showOverlay && <SideOverlay onClick={close} />}
          {openLoginModal && (
            <>
              <LoginModal close={close} signOpen={signOpen}></LoginModal>
            </>
          )}
          {openSignModal && (
            <>
              <SignUpModal close={close} loginOpen={loginOpen}></SignUpModal>
            </>
          )}
          <div>
            <Moon src={moon} alt="moon"></Moon>
            {starts.map((item, index) => {
              return <Star src={star} key={index} {...item}></Star>;
            })}
          </div>
          <StyledBtn size={"medium"} onClick={loginOpen}>
            로그인
          </StyledBtn>
          <User></User>
        </MainWarp>
      </Main>

      {/* 로그인이 되어 있는 상태 */}
      {/* <Main>
        <MainWarp>
          <Title>토끼의 발자국</Title>
          <SubTitle>고마운 마음을 담아 서로에게 덕담 한마디 어떨까요?</SubTitle>

          <div>
            <Moon src={moon} alt="moon"></Moon>
            {starts.map((item, index) => {
              return (
                <Star src={star} onClick={addStar} key={index} {...item}></Star>
              );
            })}
          </div>
          {showOverlay && <SideOverlay onClick={close} />}
          {openDuckdomModal && (
            <>
              <WriteModal close={close} signOpen={giveDuckdom}></WriteModal>
            </>
          )}
          <StyledBtn size={"medium"} onClick={giveDuckdom}>
            덕담 나눠주기
          </StyledBtn>
          <StyledBtn size={"small"}>랜덤</StyledBtn>

          <User></User>
        </MainWarp>
      </Main> */}
    </>
  );
}

export default Body;
