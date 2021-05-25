import { NzUploadFile } from "ng-zorro-antd/upload";
import { PreferenceCategory } from "../constants";
import { RecipeTag } from "./recipe-tag.model";
import { SelectionItem } from "./selection-item.model";

export interface RecipeStepperData {
  images: NzUploadFile[],
  ingredients: SelectionItem<string>[],
  preferences: { [key in PreferenceCategory]: SelectionItem<RecipeTag>[] }
}
