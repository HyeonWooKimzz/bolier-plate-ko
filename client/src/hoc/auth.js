import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from '../_actions/user_action';

export default function userAuth(
    SpecificComponent,
    option,
    adminRoute = null,
    allowedRoles = []
) {
    function AuthenticationCheck(props) {
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const [loading, setLoading] = useState(true);
        const [authorized, setAuthorized] = useState(false);

        useEffect(() => {
            let mounted = true;

            // dispatch(auth())가 reject될 수 있으므로 try/catch 패턴으로 안전하게 처리
            (async () => {
                try {
                    const response = await dispatch(auth());
                    // response가 실패를 내포할 수도 있으니 guards
                    const user = response && response.payload ? response.payload : {};

                    // 1) 비로그인 사용자
                    if (!user.isAuth) {
                        // 로그인 필요 페이지면 로그인으로 이동
                        if (option) {
                            if (mounted) navigate('/login');
                        } else {
                            // 공개 페이지라면 허용
                            if (mounted) setAuthorized(true);
                        }
                        return;
                    }

                    // 2) 로그인된 사용자 -> 관리자 체크
                    if (adminRoute && !user.isAdmin) {
                        if (mounted) {
                            // 알림은 한 번만 보이도록 window.__authAlertShown 플래그 사용
                            if (!window.__authAlertShown) {
                                window.__authAlertShown = true;
                                alert("관리자 전용 페이지입니다.");
                            }
                            navigate('/');
                        }
                        return;
                    }

                    // 3) role 체크
                    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                        if (mounted) {
                            if (!window.__authAlertShown) {
                                window.__authAlertShown = true;
                                alert('접근 권한이 없습니다.');
                            }
                            navigate('/videos');
                        }
                        return;
                    }

                    // 모두 통과
                    if (mounted) setAuthorized(true);

                } catch (err) {
                    // axios 401/네트워크 에러 등 모든 예외를 여기서 잡음
                    console.warn('Auth check error (handled):', err);

                    // 인증이 필요하면 로그인으로, 아니면 공개페이지 허용
                    if (option) {
                        if (mounted) navigate('/login');
                    } else {
                        if (mounted) setAuthorized(true);
                    }
                } finally {
                    if (mounted) setLoading(false);
                }
            })();

            return () => { mounted = false; };
        }, [dispatch, navigate]);

        // 로딩 중엔 아무것도 렌더하지 않음 (원하시면 스피너로 대체 가능)
        if (loading) return null;

        // 권한 없으면 컴포넌트 렌더하지 않음
        if (!authorized) return null;

        return <SpecificComponent {...props} />;
    }

    return AuthenticationCheck;
}
