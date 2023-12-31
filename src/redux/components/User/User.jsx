import React, { useEffect } from "react";
import styles from "./styles";
import devJeans from "../images/devJeans.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { removeCookie } from "../../../token/token";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../../token/token";
import axios from "axios";

function User() {
  const {
    Side,
    ToggleBtn,
    SideOverlay,
    NickName,
    NewNickName,
    UserName,
    UserImg,
    NewNickBtn,
    LogoutBtn,
  } = styles;

  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const refreshToken = getCookie("refreshToken");
  const accessToken = getCookie("accessToken");

  /**
   * //*사이드 바 동적 움직임 관련 코드
   */
  const toggleSide = () => {
    setIsOpen(!isOpen);
  };

  const toggleStyle = {
    right: isOpen ? "340px" : "0px",
  };

  const sideStyle = {
    display: isOpen ? "block" : "none",
  };

  /**
   * //*[useEffect] 나의 닉네임 불러오기
   */
  useEffect(() => {
    const myName = async () => {
      const response = await axios.get(
        "https://www.totobon6125.store/api/mypage",
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        }
      );
      setNickname(response.data.data.nickname);
    };
    myName();
  }, [accessToken]); // useEffect를 accessToken 의존성 배열로 감싸 갱신할 때마다 호출되도록 변경

  //* 닉네임 변경
  const changeNickName = (e) => {
    setNewNickname(e.target.value);
  };

  //* 닉네임을 클릭하면 닉네임을 작성할 수 있도록 변경
  const startEditing = () => {
    setIsEditing(true);
  };

  //* 닉네임 변경 후 저장 : 서버로 변경된 닉네임 보내기 + 페이지 리로드로 변경사항 적용
  const saveNickName = async () => {
    if (!newNickname) {
      alert("새 닉네임을 입력해 주세요!\n(최대 5글자까지 입력 가능)");
      return;
    } else {
      const response = await axios.put(
        "https://www.totobon6125.store/api/check/newnick",
        {
          nickname: newNickname,
        },
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        }
      );

      const confirmed = window.confirm(
        `새로운 닉네임으로 변경하시겠습니까?\n"${nickname}" → "${newNickname}"`
      );

      if (confirmed) {
        // 변경된 닉네임으로 업데이트
        setNickname(newNickname);
        setIsEditing(false);
        window.location.reload();
      }
    }
  };

  /**
   * //* 로그아웃 : 모든 토큰 제거
   */
  const logoutHandler = () => {
    removeCookie("accessToken");
    removeCookie("refreshToken");
    alert("[로그아웃]\n안녕히 가세요!");
    navigate("/");
  };

  return (
    <div>
      {isOpen && <SideOverlay onClick={toggleSide}></SideOverlay>}
      <ToggleBtn onClick={toggleSide} style={toggleStyle}></ToggleBtn>
      <Side style={sideStyle}>
        <UserImg src={devJeans}></UserImg>
        <NickName>
          {isEditing ? (
            //! 입력 필드 표시 (수정 중일때 상태)
            <>
              <NewNickName
                type="text"
                value={newNickname}
                onChange={changeNickName}
                maxLength={5}
                placeholder="새로운 닉네임"
              />

              <NewNickBtn
                color={"cancel"}
                onClick={() => {
                  setIsEditing(false);
                  setNewNickname(nickname); // 취소 버튼을 누르면 기존 닉네임으로 되돌리기
                }}
              >
                취소
              </NewNickBtn>
              <NewNickBtn color={"save"} onClick={saveNickName}>
                저장
              </NewNickBtn>
            </>
          ) : (
            //! 편집 모드 아닐 때는 닉네임 표시
            <>
              <UserName onClick={startEditing}>{nickname}</UserName>
              <FontAwesomeIcon
                icon={faPencil}
                style={{
                  fontSize: "18px",
                  color: "#B9B9B9",
                  marginLeft: "5px",
                }}
                onClick={startEditing} // 편집 모드로 전환
              />
            </>
          )}
        </NickName>

        <LogoutBtn onClick={logoutHandler}>로그아웃</LogoutBtn>
      </Side>
    </div>
  );
}

export default User;
