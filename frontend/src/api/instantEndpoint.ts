import { GetInstantResponse, PostInstantRequest } from 'src/model/Instant';
import http from 'src/util/http';

const postInstant = async (data: PostInstantRequest) =>
  await http.post<void, PostInstantRequest>('instant', { data });

const getInstant = async () => await http.get<GetInstantResponse>('instant');

export default {
  postInstant,
  getInstant,
};
