import * as Antd from 'antd';

type AntdType = typeof Antd;

const globalAntd: AntdType = (window as any).antd as AntdType;

export const Card = globalAntd.Card;
export const PageHeader = globalAntd.PageHeader;
export const Upload = globalAntd.Upload;
export const Button = globalAntd.Button;
export const message = globalAntd.message;
export const Form = globalAntd.Form;
export const Input = globalAntd.Input;
export const Image = globalAntd.Image;
export const Drawer = globalAntd.Drawer;
export const Space = globalAntd.Space;
export const Rate = globalAntd.Rate;
export const Descriptions = globalAntd.Descriptions;
export const Table = globalAntd.Table;
export const Switch = globalAntd.Switch;
export const Modal = globalAntd.Modal;
export const Row = globalAntd.Row;
export const Col = globalAntd.Col;
export const List = globalAntd.List;
export const Result = globalAntd.Result;
export const Tag = globalAntd.Tag;
