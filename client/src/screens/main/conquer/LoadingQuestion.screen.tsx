import { useEffect } from 'react';
import { StackActions } from '@react-navigation/native';
import { Loading } from '../../../components';
import { useSocketClient } from '../../../hooks';
import { useAppSelector } from '../../../redux/hooks';
import { selectAccount } from '../../../redux/slices/account.slice';
import { ConquerLoadingQuestionProps, IQuestion } from '../../../types';
import { openDialog } from '../../../utils';

const LoadingQuestion = (props: ConquerLoadingQuestionProps) => {
	const { navigation, route } = props;
	const { resource, room, roomMode } = route.params;
	const popAction = StackActions.pop(2);
	const { profile } = useAppSelector(selectAccount);
	const socketClient = useSocketClient();

	useEffect(() => {
		const isOwner = room.owner === profile._id;
		if (!isOwner) return;

		requestQuestions();
	}, []);
	const requestQuestions = () => {
		const questionQueryParams = {};

		socketClient?.emit('conquer[quick-match]:client-server(loading-question)', {
			mode: roomMode,
			resource: resource._id,
			room,
			questionQueryParams,
		});
	};
	useEffect(() => {
		const onLoadingQuestionEvent = (questions: IQuestion.Question[]) => {
			if (!questions.length) {
				navigation.dispatch(popAction);
				openDialog({
					title: '[Tìm câu hỏi] Không tìm thấy',
					content: 'Hiện tại không có câu hỏi phù hợp nào, quay lại sau bạn nhé',
					actions: [{ label: 'Đồng ý' }],
				});
				return;
			}

			const question = questions[0];
			navigation.navigate('QuickMatch', { resource, room, roomMode, question });
		};
		socketClient?.on('conquer[quick-match]:server-client(loading-question)', onLoadingQuestionEvent);

		const onErrorLoadingQuestionEvent = (error: string) => {
			openDialog({
				title: '[Tìm câu hỏi] Lỗi',
				content: error,
			});
		};
		socketClient?.on(
			'[ERROR]conquer[quick-match]:server-client(loading-question)',
			onErrorLoadingQuestionEvent
		);

		const onTransferOwnerLoading = () => {
			requestQuestions();
		};
		socketClient?.on('conquer:server-client(transfer-owner-loading)', onTransferOwnerLoading);

		return () => {
			socketClient?.off('conquer[quick-match]:server-client(loading-question)', onLoadingQuestionEvent);
			socketClient?.off(
				'[ERROR]conquer[quick-match]:server-client(loading-question)',
				onErrorLoadingQuestionEvent
			);
			socketClient?.off('conquer:server-client(transfer-owner-loading)', onTransferOwnerLoading);
		};
	}, []);
	return <Loading />;
};

export default LoadingQuestion;
