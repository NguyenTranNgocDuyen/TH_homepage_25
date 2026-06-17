import { WarningService } from './warning.service';
import { CreateWarningDto } from './dto/create-warning.dto';
import WarningDto from './dto/warning.dto';
import ResponseDto from "../common/response.dto";
export declare class WarningController {
    private readonly warningService;
    constructor(warningService: WarningService);
    seandWarning(createWarningDto: CreateWarningDto): Promise<ResponseDto<WarningDto>>;
}
