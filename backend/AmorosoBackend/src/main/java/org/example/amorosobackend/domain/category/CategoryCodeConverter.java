package org.example.amorosobackend.domain.category;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.example.amorosobackend.enums.CategoryCode;

@Converter(autoApply = true)
public class CategoryCodeConverter implements AttributeConverter<CategoryCode, String> {
    @Override
    public String convertToDatabaseColumn(CategoryCode attribute) {
        return attribute == null ? null : attribute.name();
    }

    @Override
    public CategoryCode convertToEntityAttribute(String dbData) {
        return dbData == null ? null : CategoryCode.valueOf(dbData);
    }
}
