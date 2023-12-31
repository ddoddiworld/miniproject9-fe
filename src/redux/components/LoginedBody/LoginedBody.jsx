import React, { useEffect } from "react";
import {
  Main,
  MainWarp,
  Title,
  SubTitle,
  StyledBtn,
  Moon,
  SideOverlay,
} from "./styles";
import moon from "../images/moon2.png";
import User from "../User/User";
import WriteModal from "../Modal/WriteModal";
import ViewModal from "../Modal/ViewModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useParams } from "react-router-dom";
import { getCookie } from "../../../token/token";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

const START_STYLES = [
  { top: "auto", left: "10%", width: "100px" }, // 왼1
  { top: "30%", right: "10%", width: "60px" }, // 오2
  { top: "55%", left: "15%", width: "60px" }, // 왼3
  { top: "38%", left: "25%", width: "80px" }, // 왼4
  { top: "65%", left: "27%", width: "120px" }, // 왼5

  { top: "19%", right: "20%", width: "100px" }, // 오1
  { top: "22%", left: "32%", width: "60px" }, // 왼2
  { top: "43%", right: "12%", width: "80px" }, // 오3
  { top: "55%", right: "25%", width: "80px" }, // 오4
  { top: "65%", right: "10%", width: "120px" }, // 오5
];

function LoginedBody() {
  // 덕담 가져오기
  const { receiverId } = useParams();
  const [duckdomData, setDuckdamData] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDuckdomModal, setOpenDuckdomModal] = useState(false);
  const [nickName, setNickName] = useState("");
  const [randomLength, setRandomLength] = useState(0);
  const navigate = useNavigate();

  const refreshToken = getCookie("refreshToken");
  const accessToken = getCookie("accessToken");

  const userId = jwt_decode(accessToken).userId;
  const currentURL = window.location.pathname;
  const isUserPage = currentURL === `/${userId}`;

  /**
   * 모달창 관련 공통 함수 정의
   * //*close : 덕담 주기 및 보기 모달창, 오버레이 닫기
   * //*giveDuckdom : 덕담 주기 모달창
   * //*showDuckdom : 덕담 보기 모달창
   */
  const close = () => {
    setShowOverlay(false);
    setOpenDuckdomModal(false);
    setOpenViewModal(false);
  };

  const giveDuckdom = () => {
    setShowOverlay(true);
    setOpenDuckdomModal(true);
  };

  const showDuckdom = () => {
    setShowOverlay(true);
    setOpenViewModal(true);
  };

  /**
   * //*[useEffect] 덕담 갯수(길이) 표시하기
   */
  useEffect(() => {
    if (receiverId) {
      axios
        .get(`https://www.totobon6125.store/api/allposts/${receiverId}`, {
          headers: {
            Authorization: `${accessToken}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setRandomLength(response.data.data.length);
          }
        })
        .catch((error) => {
          console.error("랜덤 길이 업데이트 오류:", error);
        });
    }
  }, [receiverId, accessToken]);

  /**
   * //*[useEffect] 나의 덕담 불러오기
   * //* receiverId를 기준으로 변경될 때마다 닉네임, 받은 덕담 업데이트
   */
  useEffect(() => {
    const receiveDuckdam = async () => {
      const response = await axios.get(
        `https://www.totobon6125.store/api/receive/${receiverId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        setDuckdamData(response.data.data);
      }
    };
    console.log(
      "userId : ",
      userId,
      " receiverId : ",
      receiverId,
      " isEquals? : " + userId === receiverId
    );

    if (Number(userId) === Number(receiverId)) {
      //! userId == userId : 나의 페이지에서 무언가를 한다는 뜻
      (async () => {
        const userResponse = await axios.get(
          `https://www.totobon6125.store/api/allposts/${userId}`,
          {
            headers: {
              Authorization: `${accessToken}`,
            },
          }
        );
        setNickName(userResponse.data.nicks.User.UserInfos.nickname);
      })();
      receiveDuckdam();
      setNickName(nickName);
    } else {
      //! userId !== userId : 타인의 페이지에서 무언가를 한다는 뜻
      (async () => {
        const receivedCountResponse = await axios.get(
          `https://www.totobon6125.store/api/allposts/${receiverId}`,
          {
            headers: {
              Authorization: `${accessToken}`,
            },
          }
        );
        setNickName(receivedCountResponse.data.nicks.User.UserInfos.nickname);
      })();
    }
  }, [receiverId]);

  /**
   * //*랜덤 페이지 이동하기 & 닉네임도 같이 바뀌게 하기
   */
  const random = async () => {
    const response = await axios.get(
      "https://www.totobon6125.store/api/random",
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      const randomReceiverId = response.data.data.userId;
      const receivedCountResponse = await axios.get(
        `https://www.totobon6125.store/api/allposts/${randomReceiverId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        }
      );

      if (receivedCountResponse.status === 200) {
        const receivedCount = receivedCountResponse.data.data.length;
        navigate(`/${randomReceiverId}`, { receivedCount });
        setNickName(response.data.data.nickname);
      } else {
        alert("[페이지 이동 오류] 페이지 이동을 할 수 없습니다!");
      }
    } else {
      alert("[페이지 이동 오류] 페이지 이동을 할 수 없습니다!");
    }
  };

  //![미사용] 랜덤 페이지에 대한 별 갯수 가져오기
  //
  // const randomStar = async () => {
  //   const response = await axios.get(
  //     `https://www.totobon6125.store/api/allposts/${receiverId}`,
  //     {
  //       headers: {
  //         Authorization: `${accessToken}`,
  //       },
  //     }
  //   );

  //   console.log(
  //     `${response.data.nickname}이 받은 덕담 갯수 :`,
  //     response.data.data.length
  //   );
  //   if (response.status === 200) {
  //     setRandomLength(response.data.data.length);
  //   }
  // };

  /**
   * //* 마이 페이지 이동하기 -> 한번더 mypage api 실행
   */
  const goHome = async () => {
    try {
      const response = await axios.get(
        "https://www.totobon6125.store/api/mypage",
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        navigate(`/${userId}`);
        setNickName(response.data.data.nickname);
      }
    } catch (error) {
      alert(`[마이 페이지 이동 오류]\n${error.message}`);
      console.error("마이 페이지 이동 실패! :", error.message);
    }
  };

  return (
    <>
      <Main>
        <MainWarp>
          <Title>{nickName}의 달</Title>
          <SubTitle>고마운 마음을 담아 덕담 한마디 어떨까요?</SubTitle>

          <div>
            <Moon src={moon} alt="moon"></Moon>
            {/* 덕담 보기 */}
            {showOverlay && <SideOverlay onClick={close} />}
            {userId == receiverId
              ? duckdomData.slice(0, 10).map((item, index) => {
                  const starStyles = START_STYLES[index]; // 별 갯수만큼 화면에 나타내기

                  return (
                    <ViewModal
                      starStyles={starStyles}
                      close={close}
                      signOpen={showDuckdom}
                      duckdomData={item}
                    />
                  );
                })
              : new Array(randomLength)
                  .slice(0, 10)
                  .fill(undefined)
                  .map((item, index) => {
                    const starStyles = START_STYLES[index]; // 별 갯수만큼 화면에 나타내기

                    return (
                      <ViewModal starStyles={starStyles} duckdomData={item} />
                    );
                  })}
          </div>

          {/* 덕담 주기 */}
          {showOverlay && <SideOverlay onClick={close} />}
          {openDuckdomModal && (
            <>
              <WriteModal close={close} signOpen={giveDuckdom}></WriteModal>
            </>
          )}
          {!isUserPage && (
            <>
              {/* 덕담 나눠주기 버튼 */}
              <StyledBtn size={"medium"} onClick={giveDuckdom}>
                덕담 나눠주기
              </StyledBtn>
              {/* 마이 페이지 이동 버튼 */}
              <StyledBtn size={"home"} onClick={goHome}>
                <FontAwesomeIcon icon={faHouse} />
              </StyledBtn>
            </>
          )}

          {/* 랜덤방문 */}
          <StyledBtn onClick={random} size={"small"}>
            랜덤 이동
          </StyledBtn>

          <User></User>
        </MainWarp>
      </Main>
    </>
  );
}

export default LoginedBody;
