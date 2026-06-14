import {
  BERKAS_REQ_BUP,
  BERKAS_REQ_MENINGGAL,
  BERKAS_REQ_UZUR,
} from "./../documentRequirement.constants";
import { BerkasReq } from "../../../types/proposalFile.types";

export function getBerkasReqForJenis(jenisKasus: string): BerkasReq[] {
  if (jenisKasus === "BUP") return BERKAS_REQ_BUP;
  if (jenisKasus === "Meninggal") return BERKAS_REQ_MENINGGAL;
  return BERKAS_REQ_UZUR;
}
